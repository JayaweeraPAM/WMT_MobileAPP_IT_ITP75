import { store } from '../data/store-mongo.js';

export async function getMe(req, res) {
  try {
    const user = await store.users.getById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const { passwordHash, ...safeUser } = user;
    res.json({ user: safeUser });
  } catch (err) {
    console.error('Get me error:', err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
}

export async function updateMe(req, res) {
  try {
    const { fullName, contactNumber, grade, age, parentName, parentContact, photoUrl } = req.body;
    const updates = {};
    if (fullName !== undefined) updates.fullName = fullName;
    if (contactNumber !== undefined) updates.contactNumber = contactNumber;
    if (grade !== undefined) updates.grade = grade;
    if (age !== undefined) updates.age = age ? parseInt(age) : null;
    if (parentName !== undefined) updates.parentName = parentName;
    if (parentContact !== undefined) updates.parentContact = parentContact;
    if (photoUrl !== undefined) updates.photoUrl = photoUrl;
    updates.updatedAt = new Date().toISOString();

    await store.users.updateOne(req.user.id, updates);

    const updated = await store.users.getById(req.user.id);
    const { passwordHash, ...safeUser } = updated;
    res.json({ success: true, user: safeUser });
  } catch (err) {
    console.error('Update me error:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
}

export async function getUserProfile(req, res) {
  try {
    const user = await store.users.getById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const { passwordHash, ...safeUser } = user;
    res.json({ user: safeUser });
  } catch (err) {
    console.error('Get user profile error:', err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
}

export async function deleteMe(req, res) {
  try {
    const user = await store.users.getById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const role = (user.role || '').toLowerCase();
    if (role === 'tutor' || role === 'tutor_pending') {
      await store.tutors.deleteOne(req.user.id);
    }

    await store.users.deleteOne(req.user.id);

    res.json({ success: true, message: 'Account deleted successfully' });
  } catch (err) {
    console.error('Delete me error:', err);
    res.status(500).json({ error: 'Failed to delete account' });
  }
}
