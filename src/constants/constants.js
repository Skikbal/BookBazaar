export const userRoleEnum = {
  ADMIN: "admin",
  USER: "user",
  SELLER: "seller",
};

export const availableRoles = Object.keys(userRoleEnum);

export const ratingEnum = {
  ONE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
  FIVE: 5,
};

export const availableRatings = Object.keys(ratingEnum);

export const orderStatusEnum = {
  "PENDING": "pending",
  "DELIVERED": "delivered",
  "CANCELLED": "cancelled",
  "SHIPPED": "shipped",
  "OUT FOR DELIVERY": "out for delivery",
};

export const availbaleOrderStatus = Object.keys(orderStatusEnum);
