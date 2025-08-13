# 🍃 MongoDB Atlas Setup Guide

## Step-by-Step Instructions for Jivanshu

### 1. Get Your MongoDB Atlas Connection String

1. **Go to MongoDB Atlas**: Visit [https://cloud.mongodb.com](https://cloud.mongodb.com)
2. **Login** with your credentials:
   - Username: `Jivanshu`
   - Password: `JIvanshu1`

3. **Find Your Cluster**:
   - You should see your cluster on the dashboard
   - Click the **"Connect"** button next to your cluster

4. **Choose Connection Method**:
   - Select **"Connect your application"**
   - Choose **"Node.js"** as the driver
   - Select version **"4.1 or later"**

5. **Copy Connection String**:
   - You'll see a connection string that looks like:
   ```
   mongodb+srv://Jivanshu:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
   - Copy this entire string

### 2. Update Your .env File

1. **Open the `.env` file** in your project root
2. **Replace the placeholder** in the MONGODB_URI line:

   **Before:**
   ```
   MONGODB_URI=mongodb+srv://Jivanshu:JIvanshu1@<your-cluster-url>/bookstore_db?retryWrites=true&w=majority
   ```

   **After (example):**
   ```
   MONGODB_URI=mongodb+srv://Jivanshu:JIvanshu1@cluster0.abc123.mongodb.net/bookstore_db?retryWrites=true&w=majority
   ```

   **Important**: Replace `cluster0.abc123.mongodb.net` with your actual cluster URL from step 5 above.

### 3. Common Connection String Formats

Your connection string should look like one of these:

```bash
# Format 1: Basic cluster
mongodb+srv://Jivanshu:JIvanshu1@cluster0.xxxxx.mongodb.net/bookstore_db?retryWrites=true&w=majority

# Format 2: With specific region
mongodb+srv://Jivanshu:JIvanshu1@cluster0.us-east-1.xxxxx.mongodb.net/bookstore_db?retryWrites=true&w=majority

# Format 3: Free tier cluster
mongodb+srv://Jivanshu:JIvanshu1@cluster0.mongodb.net/bookstore_db?retryWrites=true&w=majority
```

### 4. Test Your Connection

1. **Save the .env file** with your actual cluster URL
2. **Restart your server**:
   ```bash
   npm start
   ```
3. **Check the console** - you should see:
   ```
   🔧 Database URI configured: mongodb+srv://***:***@cluster0.xxxxx.mongodb.net/bookstore_db
   🍃 MongoDB connected successfully
   🚀 Server running on port 3000
   ```

### 5. Troubleshooting

**If you get connection errors:**

1. **Check Network Access**:
   - Go to MongoDB Atlas → Network Access
   - Make sure your IP address is whitelisted
   - Or add `0.0.0.0/0` to allow all IPs (for development only)

2. **Check Database User**:
   - Go to MongoDB Atlas → Database Access
   - Make sure user `Jivanshu` exists with password `JIvanshu1`
   - User should have "Read and write to any database" permissions

3. **Verify Cluster URL**:
   - Double-check that you copied the complete cluster URL
   - Make sure there are no extra spaces or characters

### 6. Example Working .env File

```bash
# MongoDB Atlas Configuration
MONGODB_URI=mongodb+srv://Jivanshu:JIvanshu1@cluster0.abc123.mongodb.net/bookstore_db?retryWrites=true&w=majority

# Server Configuration
PORT=3000
NODE_ENV=development
```

### 7. Security Notes

- ✅ The `.env` file is already added to `.gitignore`
- ✅ Your credentials won't be committed to git
- ✅ Connection string is masked in console logs
- ⚠️ Never share your `.env` file or commit it to version control

### 8. Next Steps

Once connected to MongoDB Atlas:

1. **Run demo data**:
   ```bash
   npm run demo-data
   ```

2. **Test the API**:
   ```bash
   npm run test-api
   ```

3. **Start the frontend**:
   ```bash
   cd bookstore-frontend
   npm run dev
   ```

### 🆘 Need Help?

If you're having trouble finding your cluster URL:

1. **Screenshot your MongoDB Atlas dashboard**
2. **Look for a cluster name** (usually "Cluster0" or similar)
3. **Click "Connect" → "Connect your application"**
4. **Copy the connection string shown**

The most important part is replacing `<your-cluster-url>` with the actual cluster URL from your MongoDB Atlas dashboard.

---

**Remember**: Your cluster URL is unique to your MongoDB Atlas account. The examples above are just templates - you need to use your actual cluster URL from the Atlas dashboard.
