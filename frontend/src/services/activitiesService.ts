export type ActivityResponse = {
  users: [
    {
      name: string;
      activities: [
        {
          title: string;
          image_url: string;
        }
      ];
    }
  ];
};

export async function getAllActivities() {
  const URL = "/api/activity/all";
  const token = localStorage.getItem("authToken");
  const response = await fetch(URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data: ActivityResponse = await response.json();

  const userStickers = data.users.map(({ name, activities }) => ({
    name,
    stickers: activities.map(({ title, image_url }) => ({
      title,
      url: image_url,
    })),
  }));

  return userStickers;
}
