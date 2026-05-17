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
import { Textarea } from '@/components/ui/textarea';
import {
  User, Mail, MapPin, Stethoscope, Save,
  Loader2, Lock, Shield, Star, DollarSign, Clock
} from 'lucide-react';
import { toast } from 'sonner';
import { getInitials } from '@/lib/utils';
import axios from 'axios';

export function DoctorProfileEditClient({ user, doctor }) {
  const [loading, setLoading] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      bio: doctor?.bio || '',
      experience: doctor?.experience || '',
      consultationFee: doctor?.consultationFee || '',
      languages: doctor?.languages?.join(', ') || '',
      isAvailableForOnline: doctor?.isAvailableForOnline || false,
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
        address: { street: values.street, city: values.city },
        bio: values.bio,
        experience: values.experience,
        consultationFee: values.consultationFee,
        languages: values.languages ? values.languages.split(',').map(l => l.trim()).filter(Boolean) : [],
        isAvailableForOnline: values.isAvailableForOnline,
      });
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
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500 text-sm">Update your professional and personal information</p>
      </motion.div>

      {/* Header Card */}
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
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
          <p className="text-blue-600 font-medium text-sm">{doctor?.specialization}</p>
          <p className="text-gray-500 text-sm flex items-center gap-1.5 mt-0.5">
            <Mail className="w-3.5 h-3.5" /> {user?.email}
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {doctor?.ratings?.average > 0 && (
              <span className="flex items-center gap-1 text-xs text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> {doctor.ratings.average.toFixed(1)}
              </span>
            )}
            {doctor?.experience > 0 && (
              <span className="flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                <Clock className="w-3 h-3" /> {doctor.experience}y exp
              </span>
            )}
            {doctor?.consultationFee > 0 && (
              <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                <DollarSign className="w-3 h-3" /> ₹{doctor.consultationFee}
              </span>
            )}
            {user?.isVerified && (
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs">
                <Shield className="w-3 h-3 mr-1" /> Verified
              </Badge>
            )}
          </div>
        </div>
      </motion.div>

      <Tabs defaultValue="personal">
        <TabsList className="bg-white border border-gray-100 mb-6">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="professional">Professional</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* Personal Tab */}
        <TabsContent value="personal">
          <form onSubmit={form.handleSubmit(onSave)}>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-500" /> Basic Information
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-700 mb-1.5 block">Full Name</Label>
                  <Input {...form.register('name')} placeholder="Dr. Full Name" />
                </div>
                <div>
                  <Label className="text-gray-700 mb-1.5 block">Phone Number</Label>
                  <Input {...form.register('phone')} placeholder="10-digit mobile" />
                </div>
                <div className="sm:col-span-2">
                  <Label className="text-gray-700 mb-1.5 block">Email Address</Label>
                  <Input value={user?.email} disabled className="bg-gray-50 text-gray-500 cursor-not-allowed" />
                </div>
              </div>

              <Separator />
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-500" /> Location
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-700 mb-1.5 block">Street / Clinic Address</Label>
                  <Input {...form.register('street')} placeholder="Address" />
                </div>
                <div>
                  <Label className="text-gray-700 mb-1.5 block">City</Label>
                  <Input {...form.register('city')} placeholder="City" />
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

        {/* Professional Tab */}
        <TabsContent value="professional">
          <form onSubmit={form.handleSubmit(onSave)}>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-blue-500" /> Professional Details
              </h3>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-700 mb-1.5 block">Specialization</Label>
                  <Input value={doctor?.specialization || ''} disabled className="bg-gray-50 text-gray-500 cursor-not-allowed" />
                  <p className="text-xs text-gray-400 mt-1">Contact admin to change specialization</p>
                </div>
                <div>
                  <Label className="text-gray-700 mb-1.5 block">Department</Label>
                  <Input value={doctor?.departmentName || ''} disabled className="bg-gray-50 text-gray-500 cursor-not-allowed" />
                </div>
                <div>
                  <Label className="text-gray-700 mb-1.5 block">Years of Experience</Label>
                  <Input {...form.register('experience')} type="number" min="0" placeholder="e.g. 10" />
                </div>
                <div>
                  <Label className="text-gray-700 mb-1.5 block">Consultation Fee (₹)</Label>
                  <Input {...form.register('consultationFee')} type="number" min="0" placeholder="e.g. 500" />
                </div>
                <div className="sm:col-span-2">
                  <Label className="text-gray-700 mb-1.5 block">
                    Languages Spoken <span className="text-gray-400 font-normal">(comma separated)</span>
                  </Label>
                  <Input {...form.register('languages')} placeholder="e.g. English, Hindi, Telugu" />
                </div>
                <div className="sm:col-span-2">
                  <Label className="text-gray-700 mb-1.5 block">About / Bio</Label>
                  <Textarea {...form.register('bio')} rows={4} placeholder="Write a brief professional bio..." />
                </div>
                <div className="sm:col-span-2 flex items-center gap-3">
                  <input
                    {...form.register('isAvailableForOnline')}
                    type="checkbox"
                    id="online"
                    className="w-4 h-4 rounded border-gray-300 accent-blue-600"
                  />
                  <Label htmlFor="online" className="text-gray-700 cursor-pointer">
                    Available for online video consultations
                  </Label>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                  {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : <><Save className="w-4 h-4 mr-2" /> Save Professional Info</>}
                </Button>
              </div>
            </div>
          </form>
        </TabsContent>

        {/* Security Tab */}
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
