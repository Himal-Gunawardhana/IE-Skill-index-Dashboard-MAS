# Sample Firestore Data Structure

This document shows how to structure data in your Firebase Firestore database for the IE Skill Index Dashboard.

## Collections Overview

Your Firestore should have these collections:

- `assessments` (main data)
- `users` (user info)
- `styles` (garment styles)
- `operations` (sewing operations)

## Sample Data

### 1. Assessments Collection

**Collection Name**: `assessments`

**Sample Document**:

```json
{
  "styleId": "style001",
  "styleName": "Basic T-Shirt",
  "operationId": "op001",
  "operationName": "Front Join",
  "smv": 0.45,
  "machineType": "Single Needle Lock Stitch",
  "shift": "A",
  "teamMember": "Nimal Perera",
  "epf": "EPF12345",
  "date": "Timestamp(2024-01-15 08:30:00)",
  "responsibleIE": "Kasun",
  "moduleNumber": 5,
  "timerValues": [28.5, 27.8, 29.2, 28.1, 27.9, 28.6, 28.3, 27.5, 28.9, 28.0],
  "numberOfGoodGarments": 10,
  "ssv": 27,
  "averageTime": 28.28,
  "efficiency": 95.48,
  "ftt": 100,
  "skillLevel": 4,
  "createdBy": "userId123"
}
```

### 2. Users Collection

**Collection Name**: `users`

**Sample Document**:

```json
{
  "email": "admin@maskreeda.com",
  "name": "Admin User",
  "isAdmin": true
}
```

### 3. Styles Collection

**Collection Name**: `styles`

**Sample Document**:

```json
{
  "name": "Basic T-Shirt"
}
```

### 4. Operations Collection

**Collection Name**: `operations`

**Sample Document**:

```json
{
  "name": "Front Join",
  "description": "Join front body panels",
  "smv": 0.45,
  "machineType": "Single Needle Lock Stitch"
}
```

## How to Add Data to Firestore

### Using Firebase Console (Manual Entry)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `ie-skill-index`
3. Click "Firestore Database" in left menu
4. Click "Start collection"
5. Enter collection name (e.g., "assessments")
6. Add documents with fields matching the schema above

### Important Notes

#### For Timestamps

- When adding a date field manually in Firebase Console, use "timestamp" type
- The format should be: YYYY-MM-DD HH:mm:ss
- Example: 2024-01-15 08:30:00

#### For Arrays

- timerValues should be an array of numbers
- Click "+" to add array field
- Add each timer value as a number item

#### For Numbers

- smv, ssv, efficiency, ftt, skillLevel, moduleNumber should be number type
- Don't put quotes around them in Firebase Console

## Sample Test Dataset

Here are 5 sample assessments you can add to test the dashboard:

### Assessment 1 (Expert Worker)

```
styleId: "style001"
styleName: "Basic T-Shirt"
operationId: "op001"
operationName: "Front Join"
smv: 0.45
machineType: "Single Needle Lock Stitch"
shift: "A"
teamMember: "Nimal Perera"
epf: "EPF12345"
date: [Today's date]
responsibleIE: "Kasun"
moduleNumber: 5
timerValues: [28.5, 27.8, 29.2, 28.1, 27.9, 28.6, 28.3, 27.5, 28.9, 28.0]
numberOfGoodGarments: 10
ssv: 27
averageTime: 28.28
efficiency: 95.48
ftt: 100
skillLevel: 4
createdBy: "system"
```

### Assessment 2 (Advanced Worker)

```
styleId: "style001"
styleName: "Basic T-Shirt"
operationId: "op002"
operationName: "Sleeve Attach"
smv: 0.52
machineType: "Overlock 3 Thread"
shift: "B"
teamMember: "Saman Silva"
epf: "EPF12346"
date: [Today's date]
responsibleIE: "Dilshan"
moduleNumber: 8
timerValues: [35.2, 36.1, 34.8, 35.5, 36.0, 35.7, 35.3, 35.9, 35.6, 35.4]
numberOfGoodGarments: 10
ssv: 31.2
averageTime: 35.55
efficiency: 87.75
ftt: 100
skillLevel: 4
createdBy: "system"
```

### Assessment 3 (Intermediate Worker)

```
styleId: "style002"
styleName: "Polo Shirt"
operationId: "op003"
operationName: "Collar Attach"
smv: 0.65
machineType: "Single Needle Lock Stitch"
shift: "A"
teamMember: "Ruwan Fernando"
epf: "EPF12347"
date: [Today's date]
responsibleIE: "Kasun"
moduleNumber: 12
timerValues: [45.2, 44.8, 46.1, 45.5, 45.9, 45.3, 45.7, 46.0, 45.4, 45.6]
numberOfGoodGarments: 10
ssv: 39
averageTime: 45.55
efficiency: 85.62
ftt: 100
skillLevel: 4
createdBy: "system"
```

### Assessment 4 (Beginner Worker)

```
styleId: "style001"
styleName: "Basic T-Shirt"
operationId: "op001"
operationName: "Front Join"
smv: 0.45
machineType: "Single Needle Lock Stitch"
shift: "B"
teamMember: "Kumari Dias"
epf: "EPF12348"
date: [Today's date]
responsibleIE: "Dilshan"
moduleNumber: 15
timerValues: [52.3, 51.8, 53.2, 52.5, 51.9, 52.7, 52.1, 52.9, 52.4, 52.6]
numberOfGoodGarments: 10
ssv: 27
averageTime: 52.44
efficiency: 51.49
ftt: 100
skillLevel: 2
createdBy: "system"
```

### Assessment 5 (Machine Type Variety)

```
styleId: "style003"
styleName: "Denim Jeans"
operationId: "op004"
operationName: "Belt Loop Attach"
smv: 0.38
machineType: "Bartack"
shift: "A"
teamMember: "Lakmal Perera"
epf: "EPF12349"
date: [Today's date]
responsibleIE: "Kasun"
moduleNumber: 3
timerValues: [26.5, 25.8, 26.2, 26.0, 25.9, 26.3, 26.1, 25.7, 26.4, 26.0]
numberOfGoodGarments: 10
ssv: 22.8
averageTime: 26.09
efficiency: 87.39
ftt: 100
skillLevel: 4
createdBy: "system"
```

## Calculation Formulas

For reference, here's how the calculated fields work:

### SSV (Standard Second Value)

```
SSV = SMV × 60
```

Example: If SMV = 0.45, then SSV = 0.45 × 60 = 27 seconds

### Average Time

```
Average Time = Sum of all timer values / Number of timer values
```

Example: [28.5, 27.8, ...] → Average = 28.28 seconds

### Efficiency

```
Efficiency = (SSV / Average Time) × 100
```

Example: (27 / 28.28) × 100 = 95.48%

### FTT (First Time Through)

```
FTT = (Number of Good Garments / Number of Timer Values) × 100
```

Example: (10 / 10) × 100 = 100%

### Skill Level

Based on FTT and Efficiency:

- Level 1 (Beginner): FTT = 100%, Efficiency < 40%
- Level 2 (Intermediate): FTT = 100%, Efficiency 40-60%
- Level 3 (Advanced): FTT = 100%, Efficiency 60-80%
- Level 4 (Expert): FTT = 100%, Efficiency > 80%

## Quick Import Script (Optional)

If you want to import data programmatically, you can use the Firebase Admin SDK or the Firestore REST API. However, for initial testing, manual entry through Firebase Console is simplest.

## Verification

After adding data:

1. Go to Firestore Database in Firebase Console
2. Verify you see:
   - ✅ assessments collection with documents
   - ✅ Each document has all required fields
   - ✅ Data types are correct (numbers, strings, timestamps, arrays)
3. Start the dashboard: `npm start`
4. Login and verify data appears on Dashboard page

## Common Mistakes to Avoid

❌ **Don't** use strings for numbers (efficiency: "95.48" ✗)  
✅ **Do** use number type (efficiency: 95.48 ✓)

❌ **Don't** forget to set timestamp type for date field  
✅ **Do** use Firestore timestamp type

❌ **Don't** leave out required fields  
✅ **Do** include all fields from the schema

❌ **Don't** use inconsistent EPF/style/operation IDs  
✅ **Do** use consistent IDs across documents

## Need Help?

- Refer to [Firebase Documentation](https://firebase.google.com/docs/firestore)
- Check `README.md` for dashboard features
- Review `src/types/index.ts` for exact data structure

---

**Once you have data in Firestore, your dashboard will come alive with real-time analytics! 📊**
