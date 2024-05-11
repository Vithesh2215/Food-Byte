"use client";
import { useEffect , useState } from "react";
import { UserTabs } from "@/components/layouts/UserTabs";
import { useProfile as profile} from "@/components/UseProfile";
import { useRouter } from "next/router";
import { Image } from "cloudinary-react";
import DeleteButton from "@/components/DeleteButton";

const IndividualCategoryPage = () => {
  const { id } = useRouter().query;
  const { loading: profileLoading, data: profileData } = profile();
  const [category, setCategory] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    if (!id) return;

    const fetchCategory = async () => {
      const res = await fetch(`/api/Categories`);
      const categories = await res.json();
      const foundCategory = categories.find((i) => i._id === id);
      setCategory(foundCategory);
      setCategoryName(foundCategory?.name);
    };

    const fetchMenuItems = async () => {
      const res = await fetch(`/api/menuitems`);
      const items = await res.json();
      const filteredMenuItems = items.filter((i) => i.category === id);
      setMenuItems(filteredMenuItems);
    };

    fetchCategory();
    fetchMenuItems();
  }, [id]);

  if (profileLoading) {
    return "Loading User Profile";
  }

  if (!profileData.admin) {
    return "Not an Admin";
  }

  return (
    <section className="mt-8 max-w-2xl mx-auto">
      <UserTabs isadmin={true} />
      {/* Rest of your component code */}
    </section>
  );
};

export default IndividualCategoryPage;
