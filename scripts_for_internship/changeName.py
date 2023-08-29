import os

# Set the main directory
main_directory = r'C:\Users\kevin\Documents\TNWD- Training\Quebec'

# Iterate through subdirectories (subcities) in the main directory
for subcity in os.listdir(main_directory):
    subcity_directory = os.path.join(main_directory, subcity)
    
    # Check if the item in the main directory is a directory itself
    if os.path.isdir(subcity_directory):
        # Get a list of all files in the subcity directory
        file_list = os.listdir(subcity_directory)
        
        # Counter for renaming
        index = 1
        
        # Iterate through each file and rename
        for filename in file_list:
            # Check if the file is an image (png, jpg, jpeg, gif)
            if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.gif')):
                # Get the file extension
                file_extension = os.path.splitext(filename)[1]
                
                new_filename = f'{subcity}_{index}{file_extension}'
                old_path = os.path.join(subcity_directory, filename)
                new_path = os.path.join(subcity_directory, new_filename)
                
                # Rename the file
                os.rename(old_path, new_path)
                
                print(f'Renamed: {filename} -> {new_filename}')
                
                index += 1

print('All files renamed.')

