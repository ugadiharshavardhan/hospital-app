import Appointment from '@/models/Appointment';
import { TIME_SLOTS } from '@/utils/constants';

export async function reassignTokens(doctorId, date) {
  if (!doctorId || !date) return;

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  // Find all appointments for this doctor on this day that are not cancelled
  const appointments = await Appointment.find({
    doctorId,
    date: { $gte: startOfDay, $lte: endOfDay },
    status: { $in: ['pending', 'confirmed', 'completed'] },
  });

  // Sort chronologically by their slot timing index in TIME_SLOTS
  appointments.sort((a, b) => {
    const indexA = TIME_SLOTS.indexOf(a.slot);
    const indexB = TIME_SLOTS.indexOf(b.slot);
    return indexA - indexB;
  });

  // Save new sequential token numbers starting from 1
  for (let i = 0; i < appointments.length; i++) {
    appointments[i].tokenNumber = i + 1;
    await appointments[i].save();
  }
}
