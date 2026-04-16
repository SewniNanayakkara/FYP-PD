import os
import shutil




BASE_DATASET = os.path.join("dataset", "MRI Data")
OUTPUT_DATASET = "dataset_extracted"

NON_PD_DIR = os.path.join(BASE_DATASET, "Non PD Patients")
PD_DIR = os.path.join(BASE_DATASET, "PD Patients")




os.makedirs(os.path.join(OUTPUT_DATASET, "Healthy"), exist_ok=True)
os.makedirs(os.path.join(OUTPUT_DATASET, "Parkinson"), exist_ok=True)




def extract_images(subject_root, label_folder):
    for subject in os.listdir(subject_root):
        subject_path = os.path.join(subject_root, subject)

        if not os.path.isdir(subject_path):
            continue

        mri_folder = os.path.join(subject_path, "1.MRI")

        
        if not os.path.exists(mri_folder):
            print(f"Skipping {subject} (no 1.MRI folder)")
            continue

        for img in os.listdir(mri_folder):
            if img.lower().endswith((".png", ".jpg", ".jpeg", ".bmp")):
                src = os.path.join(mri_folder, img)
                new_name = f"{subject}_{img}"
                dst = os.path.join(OUTPUT_DATASET, label_folder, new_name)
                shutil.copy(src, dst)

        print(f"Processed {subject}")




print("Extracting Healthy (Non-PD) subjects...")
extract_images(NON_PD_DIR, "Healthy")

print("Extracting Parkinson (PD) subjects...")
extract_images(PD_DIR, "Parkinson")

print("MRI image extraction completed successfully.")
