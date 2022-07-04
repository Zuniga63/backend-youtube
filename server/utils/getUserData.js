module.exports = (user) => ({
  id: user.id,
  name: user.fullName,
  firstName: user.firstName,
  lastName: user.lastName,
  avatar: user.avatarUrl,
  hasAvatar: !!user.avatar || false,
  email: user.email,
  likes: user.likes,
  createdAt: user.createdAt,
});
