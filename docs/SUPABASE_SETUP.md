# Supabase Authentication Setup Guide

This guide walks you through integrating Supabase authentication with the TransactIQ platform.

---

## 🚀 Quick Setup (15 minutes)

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click **New Project**
3. Choose an organization (or create one)
4. Enter:
   - **Project Name**: `transactiq-prod`
   - **Database Password**: Save this securely!
   - **Region**: Choose closest to your users
5. Click **Create new project** (takes ~2 minutes)

### Step 2: Get API Keys

1. In your project dashboard, go to **Settings > API**
2. Copy these values:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon/public key** → `VITE_SUPABASE_ANON_KEY`

### Step 3: Configure Environment Variables

Create/edit `frontend/.env`:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# API URL
VITE_API_URL=http://localhost:8000/api/v1
```

> ⚠️ **Never commit `.env` files to git!**

---

## 🔐 Authentication Setup

### Step 4: Install Supabase Client

```bash
cd frontend
npm install @supabase/supabase-js
```

### Step 5: Create Supabase Client

Create `frontend/src/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### Step 6: Update AuthContext

Replace the demo login functions with Supabase auth:

```typescript
// In AuthContext.tsx, add these methods:

import { supabase } from '@/lib/supabase'

const signInWithSupabase = async (email: string, password: string) => {
  setIsLoading(true)
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) {
    setIsLoading(false)
    return false
  }
  
  // Map Supabase user to app user
  setUser({
    id: data.user.id,
    email: data.user.email!,
    name: data.user.user_metadata.name || 'User',
    role: data.user.user_metadata.role || 'viewer',
  })
  
  setIsLoading(false)
  return true
}

const signUpWithSupabase = async (email: string, password: string, name: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, role: 'viewer' }
    }
  })
  
  return !error
}

// Add session listener in useEffect:
useEffect(() => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata.name || 'User',
          role: session.user.user_metadata.role || 'viewer',
        })
      } else {
        setUser(null)
      }
      setIsLoading(false)
    }
  )
  
  return () => subscription.unsubscribe()
}, [])
```

---

## 🔒 Row Level Security (RLS)

Protect your data by enabling RLS policies in Supabase.

### Enable RLS on Tables

Go to **Database > Tables** in Supabase dashboard, and run these SQL commands:

```sql
-- Enable RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchants ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read all data
CREATE POLICY "Authenticated users can read transactions"
ON transactions FOR SELECT
TO authenticated
USING (true);

-- Only admins can insert/update
CREATE POLICY "Admins can insert transactions"
ON transactions FOR INSERT
TO authenticated
WITH CHECK (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);
```

### Create User Profiles Table

```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'viewer' CHECK (role IN ('admin', 'analyst', 'viewer')),
  organization TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'name',
    COALESCE(NEW.raw_user_meta_data->>'role', 'viewer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

---

## 📧 Email Templates

Customize auth emails in **Authentication > Email Templates**:

### Confirmation Email

```html
<h2>Welcome to TransactIQ</h2>
<p>Click below to confirm your account:</p>
<a href="{{ .ConfirmationURL }}" style="
  background: linear-gradient(to right, #2563eb, #4f46e5);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  text-decoration: none;
">Confirm Email</a>
```

---

## ✅ Verification Checklist

- [ ] Supabase project created
- [ ] Environment variables set
- [ ] `@supabase/supabase-js` installed
- [ ] AuthContext updated with Supabase methods
- [ ] RLS policies configured
- [ ] Email templates customized
- [ ] Test signup/login flow

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Missing Supabase env vars" | Check `.env` file exists and has correct values |
| Login not working | Verify email confirmation is disabled in Auth settings (for dev) |
| RLS blocking queries | Check policy definitions in Database > Policies |

---

## 📚 Resources

- [Supabase Docs](https://supabase.com/docs)
- [Auth Helpers](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
