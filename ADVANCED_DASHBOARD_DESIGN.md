# Advanced Admin Dashboard Design Specifications

## Color Palette (Gold & Pink Theme)
- **Primary Gold**: #D4AF37, #C9A961
- **Secondary Gold**: #F4D03F, #FFC107
- **Primary Pink**: #E91E63, #EC407A
- **Secondary Pink**: #F06292, #F48FB1
- **Accent Rose**: #C2185B, #AD1457
- **Background**: #FAFAF8, #F5F5F0
- **Text Primary**: #2C2C2C
- **Text Secondary**: #666666

## Dashboard Sections

### 1. Header Section
- Premium gradient background (gold to pink)
- Welcome message with user avatar
- Quick stats cards with icons
- Search bar with advanced filters
- Notification bell with badge
- User profile dropdown

### 2. Navigation Tabs
- Elegant tab design with underline animation
- Tabs: Overview, Products, Orders, Users, Categories, Commissions, Videos, Reports, Settings
- Active tab highlight with gradient
- Smooth transitions between tabs

### 3. Overview Tab
- KPI Cards with:
  - Gradient backgrounds (gold/pink)
  - Icons with animations
  - Real-time data
  - Trend indicators (up/down)
  - Hover effects with shadow elevation
  
- Charts:
  - Orders trend (line chart with gradient fill)
  - Revenue distribution (pie chart with gold/pink colors)
  - Customer satisfaction (gauge chart)
  - Sales by category (bar chart)

- Quick Actions:
  - Add Product button (gradient gold-pink)
  - Create Order button
  - Send Notification button
  - Generate Report button

### 4. Products Tab
- Advanced data table with:
  - Sortable columns
  - Advanced filtering (category, price range, status)
  - Search with autocomplete
  - Bulk actions (select multiple)
  - Edit/Delete buttons with icons
  - Add Product button (floating action button)

- Product cards view option:
  - Grid layout
  - Product image
  - Price with currency
  - Stock status
  - Quick edit button

### 5. Orders Tab
- Orders table with:
  - Order ID, Customer, Amount, Status, Date
  - Status badges (Pending, Processing, Shipped, Delivered)
  - Action buttons (View, Edit, Cancel)
  - Advanced filters (date range, status, amount range)
  - Export to PDF/Excel button

- Order details modal:
  - Customer info
  - Items list
  - Timeline of order status
  - Notes section

### 6. Users Tab
- Users table with:
  - User info (name, email, avatar)
  - Role (Admin, User, Seller)
  - Status (Active, Inactive)
  - Join date
  - Action buttons (Edit, Deactivate, Delete)

- User management:
  - Add new user button
  - Bulk email send
  - Role assignment

### 7. Advanced Features

#### Search & Filter
- Global search across all sections
- Advanced filters panel
- Saved filter presets
- Filter suggestions

#### Export & Reports
- Export to PDF with formatting
- Export to Excel with formulas
- Generate custom reports
- Schedule report emails

#### Notifications
- Real-time notifications
- Notification center
- Mark as read/unread
- Clear all button

#### Analytics
- Advanced charts and graphs
- Custom date range selection
- Comparison mode
- Trend analysis

## Button Styles

### Primary Button (Gold Gradient)
- Background: Linear gradient from #D4AF37 to #F4D03F
- Text: White
- Hover: Darker gradient with shadow
- Active: Scale down slightly
- Border radius: 8px
- Padding: 12px 24px

### Secondary Button (Pink Gradient)
- Background: Linear gradient from #E91E63 to #F06292
- Text: White
- Hover: Darker gradient with shadow
- Active: Scale down slightly
- Border radius: 8px
- Padding: 12px 24px

### Icon Button
- Background: Transparent
- Icon color: Gold or Pink
- Hover: Background with opacity
- Border radius: 50%
- Size: 40px x 40px

### Floating Action Button (FAB)
- Background: Gradient gold-pink
- Icon: White
- Position: Bottom right
- Shadow: Elevation 8
- Hover: Elevation 12 with scale

## Animations & Transitions

### Hover Effects
- Card elevation (shadow increase)
- Color transition (0.3s ease)
- Scale transform (1.02x)
- Icon rotation (5-10 degrees)

### Page Transitions
- Fade in (0.3s)
- Slide up (0.4s)
- Stagger children (0.1s delay)

### Loading States
- Skeleton loaders
- Pulse animation
- Progress bars with gradient

### Success/Error States
- Toast notifications with icons
- Color coded (green for success, red for error)
- Auto-dismiss after 3 seconds

## Responsive Design
- Mobile: Single column layout
- Tablet: 2-column layout
- Desktop: Full multi-column layout
- Collapsible sidebar on mobile
- Responsive tables with horizontal scroll

## Accessibility
- ARIA labels on all buttons
- Keyboard navigation support
- Color contrast ratio > 4.5:1
- Focus indicators visible
- Screen reader friendly

## Performance
- Lazy load charts
- Virtual scrolling for large tables
- Debounced search/filter
- Optimized re-renders
- Code splitting by tab
