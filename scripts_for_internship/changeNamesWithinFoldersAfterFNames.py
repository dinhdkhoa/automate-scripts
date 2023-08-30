import os

def rename_files_by_city(main_directory):
    # Iterate through subdirectories (cities) in the main directory
    for city in os.listdir(main_directory):
        city_directory = os.path.join(main_directory, city)
        
        # Check if the item in the main directory is a directory itself
        if os.path.isdir(city_directory):
            # Get a list of all files in the city's directory
            file_list = os.listdir(city_directory)
            
            # Counter for renaming
            index = 1
            
            # Iterate through each file and rename
            for filename in file_list:
                # Check if the file is an image (png, jpg, jpeg, gif)
                if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.gif')):
                    # Get the file extension
                    file_extension = os.path.splitext(filename)[1]
                    
                    new_filename = f'{city}_web_design_{index}{file_extension}'
                    old_path = os.path.join(city_directory, filename)
                    new_path = os.path.join(city_directory, new_filename)
                    
                    # Rename the file
                    os.rename(old_path, new_path)
                    
                    print(f'Renamed: {filename} -> {new_filename}')
                    
                    index += 1

def main():
    main_directory = r'C:\Users\kevin\Documents\TNWD- Training\Quebec'
    rename_files_by_city(main_directory)
    print('All files renamed.')

if __name__ == '__main__':
    main()
