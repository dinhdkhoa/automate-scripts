import os
import shutil

def duplicate_folder(folder_path, new_folder_names):
    for new_folder_name in new_folder_names:
        new_folder_path = os.path.join(os.path.dirname(folder_path), new_folder_name)
        
        # Check if the new folder already exists, if not, create it
        if not os.path.exists(new_folder_path):
            os.makedirs(new_folder_path)
            
        # Copy the contents of the original folder to the new folder
        for item in os.listdir(folder_path):
            item_path = os.path.join(folder_path, item)
            new_item_path = os.path.join(new_folder_path, item)
            
            # If it's a file, copy it; if it's a subdirectory, copy it recursively
            if os.path.isfile(item_path):
                shutil.copy2(item_path, new_item_path)
            elif os.path.isdir(item_path):
                shutil.copytree(item_path, new_item_path)
            
        print(f'Contents of {os.path.basename(folder_path)} duplicated to {new_folder_name}.')

def main():
    main_directory = r'C:\Users\kevin\Documents\TNWD- Training\Quebec'
    folder_names_to_duplicate = os.listdir(main_directory)
    new_folder_names = ['Montreal', 'Laval', 'Quebec City', 'Gatineau', "Longueuil", "Sherbrooke", "Saguenay", "Levis", "Trois-Rivieres", "Terrebonne"]
    
    for folder_name in folder_names_to_duplicate:
        folder_path = os.path.join(main_directory, folder_name)
        duplicate_folder(folder_path, new_folder_names)
    
    print('All contents duplicated.')

if __name__ == '__main__':
    main()
