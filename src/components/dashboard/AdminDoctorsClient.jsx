'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Star, Plus, Eye } from 'lucide-react';
import Link from 'next/link';
import { getInitials } from '@/lib/utils';

export function AdminDoctorsClient({ doctors }) {
  const [search, setSearch] = useState('');
  const filtered = doctors.filter(d =>
    d.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
    d.specialization?.toLowerCase().includes(search.toLowerCase()) ||
    d.departmentName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pt-14 lg:pt-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Doctors</h1>
          <p className="text-gray-500 text-sm">{doctors.length} doctors registered</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" /> Add Doctor
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="p-4 border-b">
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search doctors..." className="pl-9" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Doctor</TableHead>
                <TableHead>Specialization</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Fee</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((doc) => (
                <TableRow key={doc._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-9 h-9">
                        <AvatarFallback className="bg-blue-100 text-blue-700 text-xs font-bold">
                          {getInitials(doc.userId?.name || '')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{doc.userId?.name}</p>
                        <p className="text-xs text-gray-400">{doc.userId?.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{doc.specialization}</TableCell>
                  <TableCell className="text-sm text-gray-500">{doc.departmentName || doc.department?.name || '-'}</TableCell>
                  <TableCell className="text-sm">{doc.experience}y</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-medium">{doc.ratings?.average?.toFixed(1)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm font-medium">₹{doc.consultationFee}</TableCell>
                  <TableCell>
                    <Badge className={doc.isActive ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'bg-gray-100 text-gray-500 hover:bg-gray-100'}>
                      {doc.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="ghost" asChild>
                      <Link href={`/doctors/${doc.userId?._id}`}>
                        <Eye className="w-4 h-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
