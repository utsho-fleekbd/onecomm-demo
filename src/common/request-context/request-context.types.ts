export type BusinessAccessContext = {
  businessId: string;
  isAdmin: boolean;
  isOwner: boolean;
};

export type RequestContextStore = {
  businessAccess: Map<string, BusinessAccessContext>;
};

export const getBusinessAccessCacheKey = (userId: string, businessId: string) =>
  `${userId}:${businessId}`;
