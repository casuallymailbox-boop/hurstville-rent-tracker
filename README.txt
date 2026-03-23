HURSTVILLE RENT TRACKER
=======================

A clean, responsive web app to track rent payments and roommate contributions.

📦 DEPLOYMENT INSTRUCTIONS:
1. Save all 4 files in a folder with this exact structure:
   ├── index.html
   ├── css/
   │   └── styles.css
   ├── js/
   │   └── script.js
   └── README.txt

2. ZIP the entire folder (not the files individually)

3. Go to https://static.app/free-website-hosting
4. Sign up / Log in
5. Create a new site → Upload your ZIP file
6. Publish! Your site will be live instantly 🎉

✨ FEATURES:
• Weekly rent payment history from your Excel file
• Summary cards showing totals and net contributions
• Search by date or status
• Filter by month
• Mobile-responsive design
• Accessible (keyboard nav, ARIA labels)
• Print-friendly styles

📊 DATA NOTES:
• All monetary values in AUD
• Negative "My Net" = roommate overpaid (credit to you)
• Status: ✓ Paid, ⏳ Pending, ✗ Missed

🔧 CUSTOMIZATION:
• Edit js/script.js to add more rows from your Excel file
• Update css/styles.css colors via CSS variables at the top
• Change site title in index.html <title> tag

🛠 TROUBLESHOOTING:
• Site not loading? Ensure main file is named exactly "index.html"
• Styles missing? Check that css/styles.css path is correct
• Data not showing? Verify rentData array in script.js has entries

📄 LICENSE: Free for personal use. Data from "Rent for Hurstville.xlsx"

Last updated: March 2026
