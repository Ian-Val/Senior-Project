# Senior-Project
## Empirically Testing Resume Formatting Techniques to Optimize Application Tracking System (ATS) Resume Parsing Accuracy

Dr. Garrett Dancik | CSC 450 01 | Ian Valeta 

### Brief Description: 
In 2024, 98% of Fortune 500 companies utilized Application Tracking Systems (ATS) to streamline their talent acquisition processes[1]. ATS allow employers to post job openings where job seekers submit applications and upload copies of their resumes digitally[2]. Career centers at top universities contain advice on format resumes to be easily parsed by ATS[3], [4]. However, there is a lack of empirical evidence on how resume formatting affect ATS parsing accuracy.

#### Objective: 
Understand how trivial formatting choices affect automated resume parsing accuracy in ATS software.
- Font Family (Arial, Calibri, Courier, Times New Roman)
- Margin Size (1.00", 0.50", or 0.25")
- Bullet Point Type (Filled Circle, Open Circle, None)
- Horizontal Lines (With Lines or Without Lines)

#### Methods: 
1. Generate input data with Mistral AI LLM
2. Gather input data to Google Sheets (Fig. 2)
3. Generate resume with Google Apps Script (Fig. 3)
4. Export resume variants from Google Docs to .docx
5. Setup job posting in Workable ATS
6. Upload resume variants to Workable ATS (Fig. 4)
7.  Copy parsed resume info to Google Sheets (Fig. 5)
8. Analyze data

### Results:
Given the 72 resume variants, the email, name, location, phone number, work experience, and education were successfully parsed. Font family, margin size, bullet points, and horizontal lines had no impact on parsing accuracy within Workable ATS. Some information was not represented within the Workable interface, but the information present was 100% accurate.
