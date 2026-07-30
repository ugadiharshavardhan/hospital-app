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
import {
  User, Phone, Mail, MapPin, Heart, Shield,
  Save, Loader2, Lock, AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { getInitials } from '@/lib/utils';
import { BLOOD_GROUPS } from '@/utils/constants';
import axios from 'axios';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export function PatientProfileClient({ user, patient }) {
  const [loading, setLoading] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const router = useRouter();
  const { update } = useSession();

  const form = useForm({
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      pincode: user?.address?.pincode || '',
      ecName: user?.emergencyContact?.name || '',
      ecPhone: user?.emergencyContact?.phone || '',
      ecRelation: user?.emergencyContact?.relation || '',
      bloodGroup: patient?.bloodGroup || '',
      gender: patient?.gender || '',
      dateOfBirth: patient?.dateOfBirth ? patient.dateOfBirth.split('T')[0] : '',
      allergies: patient?.allergies?.join(', ') || '',
    },
  });

  const pwForm = useForm({
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  const onSave = async (values) => {
    setLoading(true);
    try {
      await axios.patch('/api/user/profile', {
        name: values.name,
        phone: values.phone,
        address: { street: values.street, city: values.city, state: values.state, pincode: values.pincode },
        emergencyContact: { name: values.ecName, phone: values.ecPhone, relation: values.ecRelation },
        bloodGroup: values.bloodGroup,
        gender: values.gender,
        dateOfBirth: values.dateOfBirth,
        allergies: values.allergies ? values.allergies.split(',').map(a => a.trim()).filter(Boolean) : [],
      });
      await update({ name: values.name });
      router.refresh();
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const onPasswordChange = async (values) => {
    if (values.newPassword !== values.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (values.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    setPwLoading(true);
    try {
      await axios.patch('/api/user/profile', {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      toast.success('Password changed successfully!');
      pwForm.reset();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Password change failed');
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <div className="space-y-6 pt-14 lg:pt-0 max-w-3xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500 text-sm">Manage your personal and medical information</p>
      </motion.div>

      {/* Avatar Card */}
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
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 capitalize">{user?.role}</Badge>
            {user?.isVerified && (
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                <Shield className="w-3 h-3 mr-1" /> Verified
              </Badge>
            )}
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <Tabs defaultValue="personal">
        <TabsList className="bg-white border border-gray-100 mb-6">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="medical">Medical Info</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* Personal Info */}
        <TabsContent value="personal">
          <form onSubmit={form.handleSubmit(onSave)}>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-500" /> Basic Information
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-700 mb-1.5 block">Full Name</Label>
                  <Input {...form.register('name')} placeholder="Your full name" />
                </div>
                <div>
                  <Label className="text-gray-700 mb-1.5 block">Phone Number</Label>
                  <Input {...form.register('phone')} placeholder="10-digit mobile" />
                </div>
                <div className="sm:col-span-2">
                  <Label className="text-gray-700 mb-1.5 block">Email Address</Label>
                  <Input value={user?.email} disabled className="bg-gray-50 text-gray-500 cursor-not-allowed" />
                  <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                </div>
              </div>

              <Separator />
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-500" /> Address
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Label className="text-gray-700 mb-1.5 block">Street Address</Label>
                  <Input {...form.register('street')} placeholder="House/flat, street name" />
                </div>
                <div>
                  <Label className="text-gray-700 mb-1.5 block">City</Label>
                  <Input {...form.register('city')} placeholder="City" />
                </div>
                <div>
                  <Label className="text-gray-700 mb-1.5 block">State</Label>
                  <Input {...form.register('state')} placeholder="State" />
                </div>
                <div>
                  <Label className="text-gray-700 mb-1.5 block">PIN Code</Label>
                  <Input {...form.register('pincode')} placeholder="6-digit PIN" />
                </div>
              </div>

              <Separator />
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Phone className="w-4 h-4 text-red-500" /> Emergency Contact
              </h3>
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <Label className="text-gray-700 mb-1.5 block">Contact Name</Label>
                  <Input {...form.register('ecName')} placeholder="Full name" />
                </div>
                <div>
                  <Label className="text-gray-700 mb-1.5 block">Phone</Label>
                  <Input {...form.register('ecPhone')} placeholder="Mobile number" />
                </div>
                <div>
                  <Label className="text-gray-700 mb-1.5 block">Relation</Label>
                  <Input {...form.register('ecRelation')} placeholder="e.g. Spouse, Parent" />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                  {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
                </Button>
              </div>
            </div>
          </form>
        </TabsContent>

        {/* Medical Info */}
        <TabsContent value="medical">
          <form onSubmit={form.handleSubmit(onSave)}>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-500" /> Medical Information
              </h3>
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <Label className="text-gray-700 mb-1.5 block">Blood Group</Label>
                  <select
                    {...form.register('bloodGroup')}
                    className="w-full h-10 rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select</option>
                    {BLOOD_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <Label className="text-gray-700 mb-1.5 block">Gender</Label>
                  <select
                    {...form.register('gender')}
                    className="w-full h-10 rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <Label className="text-gray-700 mb-1.5 block">Date of Birth</Label>
                  <Input {...form.register('dateOfBirth')} type="date" />
                </div>
                <div className="sm:col-span-3">
                  <Label className="text-gray-700 mb-1.5 block">
                    Known Allergies <span className="text-gray-400 font-normal">(comma separated)</span>
                  </Label>
                  <Input {...form.register('allergies')} placeholder="e.g. Penicillin, Peanuts, Latex" />
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-700">
                  Keep your medical information up to date. Doctors rely on this during consultations.
                </p>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                  {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : <><Save className="w-4 h-4 mr-2" /> Save Medical Info</>}
                </Button>
              </div>
            </div>
          </form>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security">
          <form onSubmit={pwForm.handleSubmit(onPasswordChange)}>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Lock className="w-4 h-4 text-blue-500" /> Change Password
              </h3>
              <div className="space-y-4 max-w-sm">
                <div>
                  <Label className="text-gray-700 mb-1.5 block">Current Password</Label>
                  <Input {...pwForm.register('currentPassword')} type="password" placeholder="Enter current password" />
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
