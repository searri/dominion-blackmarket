import json
import glob
import os

with open("path_override.json", "r", encoding="utf-8") as f:
    PATH_OVERRIDE = json.load(f)


def parse_simple_yaml(content):
    """
    A lightweight, dependency-free YAML parser for simple structures.
    Now ignores full-line and inline comments.
    """
    lines = content.splitlines()
    result = {}
    stack = [(result, -1)]  # (current_dict/list, indentation)

    for i, line in enumerate(lines):
        # 1. Remove comments: split by '#' and take the first part
        line_content = line.split("#")[0]
        stripped = line_content.strip()

        # 2. Skip empty lines
        if not stripped:
            continue

        indent = len(line_content) - len(line_content.lstrip())

        while stack and indent <= stack[-1][1]:
            stack.pop()

        current_parent, parent_indent = stack[-1]

        if stripped.startswith("- "):
            item_content = stripped[2:].strip()
            new_item = {}

            if isinstance(current_parent, list):
                current_parent.append(new_item)

            if ":" in item_content:
                key, val = item_content.split(":", 1)
                new_item[key.strip()] = parse_val(val.strip())
                stack.append((new_item, indent))
            else:
                stack.append((new_item, indent))

        elif ":" in stripped:
            key, val = stripped.split(":", 1)
            key = key.strip()
            val = val.strip()

            if not val:
                is_list = False
                # Look ahead to see if the next non-empty/non-comment line is a list item
                for next_idx in range(i + 1, len(lines)):
                    next_stripped = lines[next_idx].split("#")[0].strip()
                    if next_stripped:
                        if next_stripped.startswith("-"):
                            is_list = True
                        break

                new_obj = [] if is_list else {}
                if isinstance(current_parent, dict):
                    current_parent[key] = new_obj
                stack.append((new_obj, indent))
            else:
                if isinstance(current_parent, dict):
                    current_parent[key] = parse_val(val)

    return result


def parse_val(val):
    """Converts string values to Python types."""
    if val.lower() == "true":
        return True
    if val.lower() == "false":
        return False
    try:
        if "." in val:
            return float(val)
        return int(val)
    except ValueError:
        return val.strip('"').strip("'")


def merge_yaml_files():
    # 1. Find all YAML files in the cards directory
    yaml_files = glob.glob("cards/*.yaml")

    combined_data = []

    print(f"Found {len(yaml_files)} files to process...")

    for file_path in yaml_files:
        try:
            # Get filename without extension (e.g., 'adventures-set' -> 'adventures-set')
            base_filename = os.path.splitext(os.path.basename(file_path))[0]

            # Remove hyphens and lowercase for the path/prefix logic
            header_clean = base_filename.replace("-", "").lower()

            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()
                raw_data = parse_simple_yaml(content)

                # We specifically want the list under the 'cards' key
                cards = raw_data.get("cards", [])

                if isinstance(cards, list):
                    for card in cards:
                        if "name" in card:
                            # Remove spaces and lowercase for the card filename part
                            clean_card_name = card["name"].replace(" ", "").lower()

                            image_path = (
                                f"images/{header_clean}/{header_clean}_{clean_card_name}.jpg"
                            )

                            if card["name"] in PATH_OVERRIDE:
                                for override in PATH_OVERRIDE[card["name"]]:
                                    card_entry = {
                                        "name": list(override.keys())[0],
                                        "image": list(override.values())[0],
                                    }
                                    combined_data.append(card_entry)
                            else:
                                card_entry = {"name": card["name"], "image": image_path}
                                combined_data.append(card_entry)

                    print(f"✅ Successfully processed {len(cards)} cards from {file_path}")
        except Exception as e:
            print(f"❌ Error reading {file_path}: {e}")

    # 2. Write the combined list to data.json
    with open("data.json", "w", encoding="utf-8") as out_file:
        json.dump(combined_data, out_file, indent=4)

    print("-" * 30)
    print(f"Done! Created 'data.json' with {len(combined_data)} total entries.")


if __name__ == "__main__":
    merge_yaml_files()
