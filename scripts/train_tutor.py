"""
SpeakUp - Speech Therapy AI Diagnostic Model Trainer
Trains an NLP and phonological error diagnosis model on child speech variations.
Evaluates diagnostic precision/recall and outputs model weights for the SpeakUp tutor.
"""

import json
import math
import os
import random
import re
from collections import defaultdict

# Deterministic seed for reproducible evaluation
random.seed(42)

CLASSES = [
    'EXACT_MATCH',
    'FRONTING',
    'GLIDING',
    'STOPPING',
    'CLUSTER_REDUCTION',
    'FINAL_CONSONANT_DELETION',
    'INTERDENTAL_SUBSTITUTION',
    'GENERAL_VARIATION'
]

COACHING_GUIDES = {
    'EXACT_MATCH': "Flawless pronunciation! Every phoneme was articulated accurately.",
    'FRONTING': "Fronting detected: you used the front of your tongue. Push air from the back of your throat: 'k-k-k'!",
    'GLIDING': "Gliding detected: curl your tongue tip upward toward the roof of your mouth instead of rounding your lips!",
    'STOPPING': "Stopping detected: keep the air flowing steadily through your teeth like a soft breeze without stopping it!",
    'CLUSTER_REDUCTION': "Cluster reduction detected: make sure to pronounce both sounds in the consonant blend together!",
    'FINAL_CONSONANT_DELETION': "Final consonant omitted: make sure to complete the word with a crisp end sound!",
    'INTERDENTAL_SUBSTITUTION': "Interdental substitution: peek the tip of your tongue gently between your front teeth and blow!",
    'GENERAL_VARIATION': "Phonetic variation heard: listen to the model pronunciation and repeat slowly."
}

# Base lexicon from curriculum
CURRICULUM_WORDS = [
    'a', 'e', 'i', 'o', 'u', 'cat', 'dog', 'ball', 'sun', 'tree', 'fish', 'bird',
    'star', 'moon', 'rain', 'lion', 'elephant', 'monkey', 'tiger', 'giraffe',
    'zebra', 'duck', 'frog', 'rabbit', 'dolphin', 'jump', 'run', 'sing', 'dance',
    'read', 'eat', 'drink', 'sleep', 'smile', 'play', 'hello', 'thank you',
    'good morning', 'please', 'sorry', 'one', 'two', 'three', 'four', 'five',
    'six', 'seven', 'eight', 'nine', 'ten', 'red', 'blue', 'green', 'yellow',
    'orange', 'purple', 'pink', 'brown', 'white', 'black'
]

def generate_training_data():
    """Generates labeled training pairs of (target, heard) -> class."""
    data = []

    for word in CURRICULUM_WORDS:
        # Exact match instances
        data.append((word, word, 'EXACT_MATCH'))
        data.append((word, f"{word}!", 'EXACT_MATCH'))
        data.append((word, f"the {word}", 'EXACT_MATCH'))

        # Fronting variations (velar k, g, c -> t, d)
        if re.search(r'[ck]', word):
            sub = re.sub(r'[ck]', 't', word)
            data.append((word, sub, 'FRONTING'))
            data.append((word, f"a {sub}", 'FRONTING'))
        if 'g' in word:
            sub = word.replace('g', 'd')
            data.append((word, sub, 'FRONTING'))

        # Gliding variations (r, l -> w, y)
        if 'r' in word and not word.startswith('w'):
            sub = word.replace('r', 'w')
            data.append((word, sub, 'GLIDING'))
        if 'l' in word:
            sub = word.replace('l', 'w')
            data.append((word, sub, 'GLIDING'))

        # Stopping variations (f, s, v -> p, t, b)
        if 'f' in word:
            sub = word.replace('f', 'p')
            data.append((word, sub, 'STOPPING'))
        if 's' in word:
            sub = word.replace('s', 't')
            data.append((word, sub, 'STOPPING'))

        # Cluster reduction (st, tr, sp, fl, bl -> single consonant)
        cluster_match = re.search(r'^(st|tr|sp|fl|bl|dr|gr|cl|pl)', word)
        if cluster_match:
            cluster = cluster_match.group(1)
            reduced = word[1:]
            data.append((word, reduced, 'CLUSTER_REDUCTION'))
            data.append((word, cluster[1] + word[2:], 'CLUSTER_REDUCTION'))

        # Final consonant deletion
        if len(word) >= 3 and not word.endswith(('a', 'e', 'i', 'o', 'u')):
            truncated = word[:-1]
            data.append((word, truncated, 'FINAL_CONSONANT_DELETION'))
            if len(word) >= 5:
                data.append((word, word[:-2], 'FINAL_CONSONANT_DELETION'))

        # Interdental substitution (th -> f or s)
        if 'th' in word:
            data.append((word, word.replace('th', 'f'), 'INTERDENTAL_SUBSTITUTION'))
            data.append((word, word.replace('th', 's'), 'INTERDENTAL_SUBSTITUTION'))

        # General phonetic variations / distractor words
        data.append((word, f"unrelated_{word}", 'GENERAL_VARIATION'))
        data.append((word, f"{word}ish", 'GENERAL_VARIATION'))

    return data

def extract_features(target, heard):
    """Extracts phonetic difference and n-gram alignment features."""
    target_clean = re.sub(r'[^a-z0-9]', '', target.lower())
    heard_clean = re.sub(r'[^a-z0-9]', '', heard.lower())

    features = {}

    # Exact identity
    features['feat_is_exact'] = 1.0 if target_clean == heard_clean else 0.0

    # Length differential
    len_diff = len(target_clean) - len(heard_clean)
    features[f'feat_len_diff_{len_diff}'] = 1.0

    # Prefix match
    features['feat_prefix_match'] = 1.0 if heard_clean.startswith(target_clean[:2]) else 0.0

    # Truncation check
    if len(target_clean) > len(heard_clean) and target_clean.startswith(heard_clean):
        features['feat_terminal_truncated'] = 1.0

    # Sound transformation pairs
    if target_clean and heard_clean:
        t_init = target_clean[0]
        h_init = heard_clean[0]
        features[f'feat_sub_{t_init}_to_{h_init}'] = 1.0

        if len(target_clean) > 1 and len(heard_clean) > 1:
            features[f'feat_bi_{target_clean[:2]}_to_{heard_clean[:2]}'] = 1.0

        # Character substitution transitions across strings
        min_len = min(len(target_clean), len(heard_clean))
        for i in range(min_len):
            tc = target_clean[i]
            hc = heard_clean[i]
            if tc != hc:
                features[f'feat_diff_{tc}_to_{hc}'] = 1.0

    # Stopping feature check
    if ('f' in target_clean and 'p' in heard_clean) or ('s' in target_clean and 't' in heard_clean):
        features['feat_stopping_detected'] = 1.0

    # Fronting feature check
    if (('c' in target_clean or 'k' in target_clean) and 't' in heard_clean) or ('g' in target_clean and 'd' in heard_clean):
        features['feat_fronting_detected'] = 1.0

    # Gliding feature check
    if ('r' in target_clean and 'w' in heard_clean) or ('l' in target_clean and 'w' in heard_clean):
        features['feat_gliding_detected'] = 1.0

    # Phoneme cluster check
    if re.search(r'^(st|tr|sp|fl|bl|dr)', target_clean) and not re.search(r'^(st|tr|sp|fl|bl|dr)', heard_clean):
        features['feat_cluster_dropped'] = 1.0

    # Th substitution check
    if 'th' in target_clean and ('f' in heard_clean or 's' in heard_clean):
        features['feat_th_sub'] = 1.0

    return features

class PhonologicalClassifier:
    """Multinomial Naive Bayes Model with Laplace smoothing for speech error diagnosis."""

    def __init__(self):
        self.class_counts = defaultdict(int)
        self.feature_counts = defaultdict(lambda: defaultdict(int))
        self.class_totals = defaultdict(int)
        self.vocabulary = set()
        self.total_docs = 0

    def fit(self, training_data):
        for target, heard, label in training_data:
            self.total_docs += 1
            self.class_counts[label] += 1
            feats = extract_features(target, heard)
            for feat, val in feats.items():
                if val > 0:
                    self.feature_counts[label][feat] += 1
                    self.class_totals[label] += 1
                    self.vocabulary.add(feat)

    def predict(self, target, heard):
        feats = extract_features(target, heard)
        best_class = None
        max_log_prob = -float('inf')
        vocab_size = max(1, len(self.vocabulary))

        for label in CLASSES:
            # Prior P(C)
            prior = math.log((self.class_counts[label] + 1) / (self.total_docs + len(CLASSES)))
            log_prob = prior

            # Likelihood P(F | C)
            total_features_in_class = self.class_totals[label] + vocab_size
            for feat, val in feats.items():
                if feat in self.vocabulary and val > 0:
                    count = self.feature_counts[label].get(feat, 0) + 1
                    log_prob += math.log(count / total_features_in_class)

            if log_prob > max_log_prob:
                max_log_prob = log_prob
                best_class = label

        return best_class or 'GENERAL_VARIATION'

def train_and_evaluate():
    print("Generating phonological speech training dataset...")
    raw_data = generate_training_data()
    random.shuffle(raw_data)

    split_idx = int(len(raw_data) * 0.8)
    train_set = raw_data[:split_idx]
    test_set = raw_data[split_idx:]

    print(f"Total Dataset: {len(raw_data)} samples | Train: {len(train_set)} | Test: {len(test_set)}")

    model = PhonologicalClassifier()
    model.fit(train_set)

    # Evaluate on held-out test split
    correct = 0
    confusion_matrix = defaultdict(lambda: defaultdict(int))

    for target, heard, actual in test_set:
        predicted = model.predict(target, heard)
        confusion_matrix[actual][predicted] += 1
        if predicted == actual:
            correct += 1

    accuracy = (correct / len(test_set)) * 100
    print(f"\nModel Training Complete!")
    print(f"Validation Accuracy: {accuracy:.2f}% ({correct}/{len(test_set)})")

    # Output per-class metrics
    print("\n--- Per-Class Metrics ---")
    for cls in CLASSES:
        tp = confusion_matrix[cls][cls]
        fp = sum(confusion_matrix[other][cls] for other in CLASSES if other != cls)
        fn = sum(confusion_matrix[cls][other] for other in CLASSES if other != cls)

        precision = (tp / (tp + fp)) * 100 if (tp + fp) > 0 else 0.0
        recall = (tp / (tp + fn)) * 100 if (tp + fn) > 0 else 0.0
        f1 = (2 * precision * recall) / (precision + recall) if (precision + recall) > 0 else 0.0

        print(f"Class: {cls:<28} | Precision: {precision:6.1f}% | Recall: {recall:6.1f}% | F1: {f1:6.1f}%")

    # Export weights & diagnostic rules to JSON
    export_payload = {
        'model_version': '1.0.0',
        'accuracy': round(accuracy, 2),
        'classes': CLASSES,
        'coaching_guides': COACHING_GUIDES,
        'vocabulary_size': len(model.vocabulary),
        'priors': {c: round(model.class_counts[c] / model.total_docs, 4) for c in CLASSES}
    }

    out_dir = os.path.join(os.path.dirname(__file__), '..', 'js')
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, 'model_weights.json')

    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(export_payload, f, indent=2)

    print(f"\nModel weights and coaching rules exported to: {out_path}")
    return accuracy

if __name__ == '__main__':
    train_and_evaluate()
