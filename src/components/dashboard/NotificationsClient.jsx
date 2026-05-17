'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Bell, Calendar, CreditCard, FileText,
  AlertCircle, CheckCheck, Trash2, Clock,
} from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const TYPE_CONFIG = {
  appointment: { icon: Calendar,    bg: 'bg-blue-100',   fg: 'text-blue-600',   label: 'Appointment' },
  payment:     { icon: CreditCard,  bg: 'bg-green-100',  fg: 'text-green-600',  label: 'Payment'     },
  prescription:{ icon: FileText,    bg: 'bg-purple-100', fg: 'text-purple-600', label: 'Prescription' },
  report:      { icon: FileText,    bg: 'bg-orange-100', fg: 'text-orange-600', label: 'Report'      },
  emergency:   { icon: AlertCircle, bg: 'bg-red-100',    fg: 'text-red-600',    label: 'Emergency'   },
  system:      { icon: Bell,        bg: 'bg-gray-100',   fg: 'text-gray-600',   label: 'System'      },
};

function timeAgo(date) {
  const diff = Date.now() - new Date(date).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins  < 1)   return 'Just now';
  if (mins  < 60)  return `${mins}m ago`;
  if (hours < 24)  return `${hours}h ago`;
  if (days  < 7)   return `${days}d ago`;
  return new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
}

export function NotificationsClient({ notifications: initial }) {
  const [notifications, setNotifications] = useState(initial);
  const [filter, setFilter]               = useState('all');
  const [markingAll, setMarkingAll]       = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const filtered = filter === 'all'
    ? notifications
    : filter === 'unread'
      ? notifications.filter(n => !n.isRead)
      : notifications.filter(n => n.type === filter);

  const markRead = async (id) => {
    setNotifications(prev =>
      prev.map(n => n._id === id ? { ...n, isRead: true } : n)
    );
    try {
      await axios.patch(`/api/notifications/${id}`);
    } catch { /* silently fail */ }
  };

  const markAllRead = async () => {
    setMarkingAll(true);
    try {
      await axios.patch('/api/notifications');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      toast.success('All notifications marked as read');
    } catch {
      toast.error('Failed to mark as read');
    } finally {
      setMarkingAll(false);
    }
  };

  return (
    <div className="space-y-6 pt-14 lg:pt-0 max-w-3xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            Notifications
            {unreadCount > 0 && (
              <Badge className="bg-blue-600 text-white hover:bg-blue-600 text-xs">
                {unreadCount} new
              </Badge>
            )}
          </h1>
          <p className="text-gray-500 text-sm">{notifications.length} total notifications</p>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={markAllRead}
            disabled={markingAll}
            className="flex items-center gap-2 text-sm"
          >
            <CheckCheck className="w-4 h-4" />
            {markingAll ? 'Marking...' : 'Mark all as read'}
          </Button>
        )}
      </motion.div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: 'all',         label: 'All' },
          { key: 'unread',      label: `Unread (${unreadCount})` },
          { key: 'appointment', label: 'Appointments' },
          { key: 'payment',     label: 'Payments' },
          { key: 'prescription',label: 'Prescriptions' },
          { key: 'system',      label: 'System' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`text-xs px-3 py-1.5 rounded-full font-medium border transition-all ${
              filter === tab.key
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
          <Bell className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">No notifications</p>
          <p className="text-gray-300 text-sm mt-1">
            {filter === 'unread' ? "You're all caught up!" : 'Nothing here yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((n, i) => {
            const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.system;
            const Icon = cfg.icon;
            return (
              <motion.div
                key={n._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => { if (!n.isRead) markRead(n._id); }}
                className={`flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer group ${
                  n.isRead
                    ? 'bg-white border-gray-100 hover:border-gray-200'
                    : 'bg-blue-50/50 border-blue-100 hover:border-blue-200'
                }`}
              >
                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${cfg.bg}`}>
                  <Icon className={`w-5 h-5 ${cfg.fg}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-semibold ${n.isRead ? 'text-gray-700' : 'text-gray-900'}`}>
                      {n.title}
                    </p>
                    <div className="flex items-center gap-2 shrink-0">
                      {!n.isRead && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full" />
                      )}
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {timeAgo(n.createdAt)}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.bg} ${cfg.fg}`}>
                      {cfg.label}
                    </span>
                    {n.link && (
                      <a
                        href={n.link}
                        onClick={e => e.stopPropagation()}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        View →
                      </a>
                    )}
                    {!n.isRead && (
                      <span className="text-xs text-gray-400 group-hover:text-blue-500 transition-colors">
                        Click to mark as read
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
