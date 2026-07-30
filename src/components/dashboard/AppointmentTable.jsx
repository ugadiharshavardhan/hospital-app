'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, Clock, MoreVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { formatShortDate, getStatusColor } from '@/utils/formatters';
import { getInitials } from '@/lib/utils';

export function AppointmentTable({ appointments = [], onStatusChange, onReschedule, showPatient = true }) {
  if (!appointments.length) {
    return (
      <div className="text-center py-12 text-gray-400">
        <Calendar className="w-10 h-10 mx-auto mb-3 opacity-30" />
        <p>No appointments found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-gray-100">
            <TableHead>{showPatient ? 'Patient' : 'Doctor'}</TableHead>
            <TableHead>Date &amp; Time</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            {(onStatusChange || onReschedule) && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((apt) => {
            const person = showPatient ? apt.patientId : apt.doctorId;
            return (
              <TableRow key={apt._id} className="border-gray-50 hover:bg-gray-50/50">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-blue-100 text-blue-700 text-xs font-bold">
                        {getInitials(person?.name || 'Unknown')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm text-gray-900">{person?.name || 'N/A'}</p>
                      {apt.department && (
                        <p className="text-[11px] text-blue-600 font-semibold bg-blue-50 px-1.5 py-0.5 rounded w-fit mt-0.5 mb-0.5">
                          {apt.department}
                        </p>
                      )}
                      <p className="text-xs text-gray-400">{person?.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm text-gray-700 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      {formatShortDate(apt.date)}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {apt.slot}
                    </span>
                    {apt.tokenNumber && (
                      <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded w-fit flex items-center gap-0.5 mt-1 border border-amber-200">
                        Token #{apt.tokenNumber}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-xs capitalize text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                    {apt.type || 'in-person'}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${getStatusColor(apt.status)}`}>
                    {apt.status}
                  </span>
                </TableCell>
                {(onStatusChange || onReschedule) && (
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="w-7 h-7">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {onStatusChange && (
                          <>
                            <DropdownMenuItem onClick={() => onStatusChange(apt._id, 'confirmed')}>Confirm</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onStatusChange(apt._id, 'completed')}>Mark Complete</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onStatusChange(apt._id, 'cancelled')} className="text-red-600">
                              Cancel
                            </DropdownMenuItem>
                          </>
                        )}
                        {onReschedule && (apt.status === 'pending' || apt.status === 'confirmed') && (
                          <DropdownMenuItem onClick={() => onReschedule(apt)}>
                            Reschedule
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
