'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Phone, Save, Loader2, Lock, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { getInitials } from '@/lib/utils';
import axios from 'axios';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export function AdminProfileClient({ user }) {
  const [loading, setLoading] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const router = useRouter();
  const { update } = useSession();

  const form = useForm({
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
    },
  });

  const pwForm = useForm({
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  const onSave = async (values) => {
    setLoading(true);
    try {
      await axios.patch('/api/user/profile', { name: values.name, phone: values.phone });
      await update({ name: values.name });
      router.refresh();
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const onPasswordChange = async (values) => {
    if (values.newPassword !== values.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setPwLoading(true);
    try {
      await axios.patch('/api/user/profile', {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      toast.success('Password updated!');
      pwForm.reset();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed');
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <div className="space-y-6 pt-14 lg:pt-0 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900">Profile & Settings</h1>
        <p className="text-gray-500 text-sm">Manage your admin account</p>
      </motion.div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-5"
      >
        <Avatar className="w-20 h-20 ring-4 ring-blue-50">
          <AvatarFallback className="bg-blue-600 text-white text-2xl font-bold">
            {getInitials(user?.name)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
          <p className="text-gray-500 text-sm flex items-center gap-1.5 mt-0.5">
            <Mail className="w-3.5 h-3.5" /> {user?.email}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 capitalize">{user?.role}</Badge>
            {user?.isVerified && (
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                <Shield className="w-3 h-3 mr-1" /> Verified
              </Badge>
            )}
          </div>
        </div>
      </motion.div>

      <Tabs defaultValue="profile">
        <TabsList className="bg-white border border-gray-100 mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <form onSubmit={form.handleSubmit(onSave)}>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-500" /> Account Details
              </h3>
              <div className="space-y-4">
                <div>
                  <Label className="text-gray-700 mb-1.5 block">Full Name</Label>
                  <Input {...form.register('name')} placeholder="Full name" />
                </div>
                <div>
                  <Label className="text-gray-700 mb-1.5 block">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input {...form.register('phone')} placeholder="10-digit mobile" className="pl-9" />
                  </div>
                </div>
                <div>
                  <Label className="text-gray-700 mb-1.5 block">Email Address</Label>
                  <Input value={user?.email} disabled className="bg-gray-50 text-gray-500 cursor-not-allowed" />
                  <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                  {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : <><Save className="w-4 h-4 mr-2" /> Save</>}
                </Button>
              </div>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="security">
          <form onSubmit={pwForm.handleSubmit(onPasswordChange)}>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Lock className="w-4 h-4 text-blue-500" /> Change Password
              </h3>
              <div className="space-y-4 max-w-sm">
                <div>
                  <Label className="text-gray-700 mb-1.5 block">Current Password</Label>
                  <Input {...pwForm.register('currentPassword')} type="password" placeholder="Current password" />
                </div>
                <div>
                  <Label className="text-gray-700 mb-1.5 block">New Password</Label>
                  <Input {...pwForm.register('newPassword')} type="password" placeholder="Min 8 characters" />
                </div>
                <div>
                  <Label className="text-gray-700 mb-1.5 block">Confirm New Password</Label>
                  <Input {...pwForm.register('confirmPassword')} type="password" placeholder="Repeat new password" />
                </div>
                <Button type="submit" disabled={pwLoading} className="w-full bg-blue-600 hover:bg-blue-700">
                  {pwLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Updating...</> : <><Lock className="w-4 h-4 mr-2" /> Update Password</>}
                </Button>
              </div>
            </div>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
