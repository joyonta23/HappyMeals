#!/usr/bin/env python3
import subprocess
import os

os.chdir(r"c:\Users\joyon_w0nysq8\Desktop\HappyMeal Food Ordering")

# Get all commits
result = subprocess.run(['git', 'log', '--all', '--pretty=format:%H'], 
                       capture_output=True, text=True)
commits = result.stdout.strip().split('\n')

print(f"Found {len(commits)} commits to process")

# Process each commit
for i, commit_hash in enumerate(reversed(commits)):
    if not commit_hash:
        continue
    
    print(f"\nProcessing commit {i+1}/{len(commits)}: {commit_hash[:7]}")
    
    # Get commit info
    result = subprocess.run(['git', 'show', '--format=%an|%ae', '-s', commit_hash],
                           capture_output=True, text=True)
    author_info = result.stdout.strip().split('|')
    
    if len(author_info) >= 2:
        current_name, current_email = author_info[0], author_info[1]
        print(f"  Current: {current_name} <{current_email}>")
        
        # If not the correct author, amend it
        if current_email != "joyontobiswas2020@gmail.com" or current_name != "Joyonta Biswas":
            env = os.environ.copy()
            env['GIT_COMMITTER_DATE'] = subprocess.run(
                ['git', 'show', '-s', '--format=%ci', commit_hash],
                capture_output=True, text=True
            ).stdout.strip()
            
            subprocess.run([
                'git', 'commit', '--amend', '--no-edit',
                f'--author=Joyonta Biswas <joyontobiswas2020@gmail.com>'
            ], env=env, cwd=r"c:\Users\joyon_w0nysq8\Desktop\HappyMeal Food Ordering")
            
            print(f"  Updated to: Joyonta Biswas <joyontobiswas2020@gmail.com>")

print("\n✅ Done! Now push with: git push -f origin main")
