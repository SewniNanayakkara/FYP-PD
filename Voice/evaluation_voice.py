import os
import numpy as np
import librosa
import joblib
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score


MODEL_PATH = "voice_model.pkl"
DATASET_PATH = "dataset"   


model = joblib.load(MODEL_PATH)


def extract_features(file_path):
    try:
        y, sr = librosa.load(file_path, duration=3, offset=0.5)
        mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
        return np.mean(mfcc.T, axis=0)
    except Exception as e:
        print(f"Error loading file {file_path}: {e}")
        return None


X = []
y = []

for label_name in ["HC_AH", "PD_AH"]:
    label = 0 if label_name == "HC_AH" else 1
    class_folder = os.path.join(DATASET_PATH, label_name)

    if not os.path.exists(class_folder):
        print(f"Folder not found: {class_folder}")
        continue

    for root, dirs, files in os.walk(class_folder):
        for file in files:
            file_path = os.path.join(root, file)

            features = extract_features(file_path)

            if features is not None:
                X.append(features)
                y.append(label)


X = np.array(X)
y = np.array(y)

print("Loaded samples:", len(X))


if len(X) == 0:
    print("❌ No data loaded. Check dataset path or audio files.")
    exit()


y_pred = model.predict(X)


print("\nAccuracy:", accuracy_score(y, y_pred))

print("\nClassification Report:")
print(classification_report(y, y_pred, target_names=["Healthy", "Parkinson"]))

print("\nConfusion Matrix:")
print(confusion_matrix(y, y_pred))