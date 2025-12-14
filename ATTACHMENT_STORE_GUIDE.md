# Attachment Store System - User Guide

## 📦 Overview

The Attachment Store system manages the inventory of sewing machine attachments in the MKB plant. It tracks attachment issuance, movements, returns, and maintains complete transaction history.

## 🎯 Features

### 1. **Dashboard Tab**
- View current inventory across all locations
- Real-time stock levels by attachment type and location
- Quick statistics (total types, locations, stock items, transactions)
- Search and filter inventory by location, type, or keyword

### 2. **Issue Attachment Tab**
- **Scan QR Code**: Scan attachment QR code to quickly identify type
- **Manual Issue**: Issue attachments to locations manually
- **Add to Stock**: Add new stock to any location

### 3. **Return / Move Tab**
- **Return to Stock**: Return attachments from locations back to stock
- **Move Between Locations**: Transfer attachments between different locations

### 4. **History Tab**
- Complete transaction history with filters
- Track who requested, when, and why
- Filter by attachment type, location, or date

### 5. **Settings Tab**
- Manage attachment types (add new types)
- Manage locations (add new locations)
- View all configured types and locations

## 📱 How to Use

### Adding a New Attachment Type

1. Click **"Attachment Store"** button in header
2. Go to **Settings** tab
3. Click **"Add Type"** button
4. Enter:
   - **Code**: e.g., WA001, WA006, etc.
   - **Name**: Descriptive name
   - **Description**: Optional details
5. Click **"Add"**

**Pre-configured Types:**
- WA001
- WA006
- WA011
- WA022
- WA033

### Adding a New Location

1. Go to **Settings** tab
2. Click **"Add Location"** button
3. Enter:
   - **Name**: Location name (e.g., "Line 1", "Main Stock")
   - **Description**: Optional details
4. Click **"Add"**

### Issuing an Attachment

#### Option 1: Using QR Scanner
1. Go to **Issue Attachment** tab
2. Click **"Scan QR Code"**
3. Scan the attachment QR code
4. System automatically identifies attachment type
5. Fill in:
   - **Location**: Where to issue
   - **Quantity**: Number of items
   - **Requested By**: Person's name
   - **Comment**: Purpose/reason
6. Click **"Issue"**

#### Option 2: Manual Entry
1. Go to **Issue Attachment** tab
2. Click **"Manual Issue"**
3. Select:
   - **Attachment Type**: Choose from dropdown
   - **Location**: Where to issue
   - **Quantity**: Number of items
   - **Requested By**: Person's name
   - **Comment**: Purpose/reason
4. Click **"Issue"**

### Adding Stock

1. Go to **Issue Attachment** tab
2. Click **"Add to Stock"**
3. Select:
   - **Attachment Type**
   - **Location**: Where to add
   - **Quantity**: Number to add
   - **Comment**: Purchase order, supplier, etc.
4. Click **"Add"**

### Returning Attachment to Stock

1. Go to **Return / Move** tab
2. Click **"Return to Stock"**
3. Select:
   - **Attachment Type**
   - **From Location**: Current location
   - **To Location**: Stock location
   - **Quantity**: Number to return
   - **Comment**: Reason for return
4. Click **"Return"**

### Moving Between Locations

1. Go to **Return / Move** tab
2. Click **"Move Between Locations"**
3. Select:
   - **Attachment Type**
   - **From Location**: Source
   - **To Location**: Destination
   - **Quantity**: Number to move
   - **Comment**: Reason for transfer
4. Click **"Move"**

### Viewing Transaction History

1. Go to **History** tab
2. Use search box to filter by attachment code, location, or person
3. View complete history with:
   - Date and time
   - Transaction type (ISSUE, RETURN, MOVE, ADD)
   - Attachment code
   - From/To locations
   - Quantity
   - Who requested
   - Comments

## 🔍 QR Code Integration

### QR Code Format
Each attachment should have a QR code containing its type code (e.g., "WA001").

### Generating QR Codes
You can generate QR codes for attachments using:
- Online QR generators: https://www.qr-code-generator.com/
- Encode the attachment code (e.g., "WA001") as text
- Print and attach to physical attachments

### Scanning
- Use the **"Scan QR Code"** button
- Camera will activate (requires permission)
- Point at QR code
- System auto-fills attachment type

## 📊 Inventory Management

### Stock Levels
- Dashboard shows current quantity at each location
- Filters help find specific items quickly
- Color-coded chips identify attachment types

### Transaction Types
- **ISSUE** (Blue): New issuance to location
- **RETURN** (Green): Return to stock
- **MOVE** (Orange): Transfer between locations
- **ADD** (Default): New stock added

### Best Practices
1. **Always add comments** explaining why
2. **Record requestor name** accurately
3. **Check stock levels** before issuing
4. **Return unused attachments** promptly
5. **Regular audits** against physical stock

## 🔒 Firebase Collections

The system uses these Firestore collections:

### `attachmentTypes`
```
{
  code: "WA001",
  name: "Attachment Name",
  description: "Description",
  createdAt: Timestamp
}
```

### `locations`
```
{
  name: "Line 1",
  description: "Production Line 1",
  createdAt: Timestamp
}
```

### `attachmentInventory`
```
{
  attachmentTypeId: "abc123",
  attachmentTypeCode: "WA001",
  locationId: "xyz789",
  locationName: "Line 1",
  quantity: 5,
  lastUpdated: Timestamp
}
```

### `attachmentTransactions`
```
{
  transactionType: "issue|return|move|add",
  attachmentTypeId: "abc123",
  attachmentTypeCode: "WA001",
  quantity: 2,
  fromLocationId: "xyz789" (optional),
  fromLocationName: "Line 1" (optional),
  toLocationId: "def456",
  toLocationName: "Line 2",
  requestedBy: "John Doe",
  comment: "For new style",
  createdBy: "admin@example.com",
  createdAt: Timestamp
}
```

## 📱 Mobile Friendly

The system is fully responsive and optimized for:
- Mobile phones (scanning on-the-go)
- Tablets (floor supervisors)
- Desktop computers (office management)

## 🚀 Future Enhancements

Potential features to add:
- [ ] Barcode scanning support
- [ ] Low stock alerts
- [ ] Export reports to Excel
- [ ] Attachment maintenance scheduling
- [ ] Photo uploads for attachments
- [ ] Approval workflow for large issues
- [ ] Integration with production planning

## 💡 Tips

1. **Create a "Main Stock" location** for central inventory
2. **Use descriptive comments** for easy tracking
3. **Train operators** on QR scanning process
4. **Regular stock takes** to verify accuracy
5. **Assign responsibility** for each location's inventory

## 🆘 Troubleshooting

### Can't see new attachment type
- Refresh the page
- Check Firebase connection
- Verify type was added successfully

### QR scanner not working
- Grant camera permissions in browser
- Ensure good lighting on QR code
- Use manual entry as fallback

### Negative stock showing
- Review transaction history
- Adjust quantities if needed
- Use "Add Stock" to correct

---

**For support, contact IE Team or System Administrator**
