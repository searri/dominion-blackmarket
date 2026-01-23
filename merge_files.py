import json
import glob
import os

def merge_json_files():
    # 1. Find all JSON files in the current directory
    # We exclude 'data.json' so we don't accidentally merge the output into itself
    json_files = [f for f in glob.glob("cards/*.json")]
    
    combined_data = []

    print(f"Found {len(json_files)} files to process...")

    for file_path in json_files:
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                # Ensure the data is a list before extending
                if isinstance(data, list):
                    combined_data.extend(data)
                else:
                    combined_data.append(data)
                print(f"✅ Successfully read {file_path}")
        except Exception as e:
            print(f"❌ Error reading {file_path}: {e}")

    # 2. Write the combined list to data.json
    with open("data.json", "w", encoding="utf-8") as out_file:
        json.dump(combined_data, out_file, indent=4)
    
    print("-" * 30)
    print(f"Done! Created 'data.json' with {len(combined_data)} total cards.")

if __name__ == "__main__":
    merge_json_files()