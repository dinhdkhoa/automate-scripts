#!/bin/bash

# Change to your repo
cd /d/hobbies/Learning-Git/commits

# Start date
date=20250415
# End date
end_date=20250502

while [[ $date -le $end_date ]]
do
  # Convert date to a format that can be used with 'date' command
  formatted_date=$(date -d"${date:0:4}-${date:4:2}-${date:6:2}" "+%Y%m%d")

  # Check if the day is a weekend
  day_of_week=$(date -d"${formatted_date}" "+%u")
  if ((day_of_week < 6)) || (( RANDOM % 100 > 70 )); then
    # Generate a random number of commits for that day (between 3 and 5)
    num_commits=$(( RANDOM % 3 + 3 ))
    for ((i=0; i<num_commits; i++))
    do
      # Create a file with the current date and commit it
      echo "${formatted_date}" > file_${formatted_date}_${i}
      git add file_${formatted_date}_${i}
      GIT_AUTHOR_DATE="${formatted_date}T12:00:00" GIT_COMMITTER_DATE="${formatted_date}T12:00:00" git commit -m "commit number ${i} on ${formatted_date}"
    done
  fi

  # Increment the date
  date=$(date -d"${formatted_date} + 1 day" "+%Y%m%d")
done
