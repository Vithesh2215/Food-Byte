import { useContext, useState } from "react";
import { CartContext } from "../AppContext";
import toast from "react-hot-toast";
import MenuItemBox from "@/components/Menu/MenuItemBox";
import Image from "next/legacy/image";
import FlyingButton from "react-flying-item";

export default function MenuItem(menuItem) {
  const { name, description, basePrice, sizes, extraIngredientPrices } =
    menuItem;

  const { addToCart } = useContext(CartContext);

  const [showPopup, setShowPopup] = useState(false);

  const [selectSize, setSelectSize] = useState(sizes?.[0] || null);
  const [selectExtras, setSelectExtras] = useState([]);

  const handleAddToCart = async () => {
    if (
      (sizes?.length > 0 || extraIngredientPrices?.length > 0) &&
      !showPopup
    ) {
      setShowPopup(true);
    } else {
      addToCart(menuItem, selectSize, selectExtras);

      await new Promise((resolve) => setTimeout(resolve, 1000));
      setShowPopup(false);
      // toast.success("Added to cart", {
      //   position: 'top-right',
      // });
    }
  };

  const handleExtras = (ev, extraThing) => {
    const checked = ev.target.checked;
    if (checked) {
      setSelectExtras((prev) => [...prev, extraThing]);
    } else {
      setSelectExtras((prev) => {
        return prev.filter((e) => e.name !== extraThing.name);
      });
    }
  };

  let selectedPrice = basePrice;
  if (selectSize) {
    selectedPrice += selectSize.price;
  }
  if (selectExtras?.length > 0) {
    for (const extra of selectExtras) {
      selectedPrice += extra.price;
    }
  }

  return (
    <>
      {showPopup && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center"
          onClick={() => setShowPopup(false)}
        >
          <div
            className="my-8 bg-white p-2 rounded-lg max-w-md"
            onClick={(ev) => ev.stopPropagation()}
          >
            <div
              className="overflow-y-scroll p-2"
              style={{ maxHeight: "calc(100vh - 100px)" }}
            >
              <Image
                src={"/menuimage.png"}
                alt="name"
                width={200}
                height={200}
                className="mx-auto"
              />
              <h2 className="text-lg font-bold text-center mb-2">{name}</h2>
              <p className="text-center text-gray-500 text-sm mb-2">
                {description}
              </p>
              {sizes?.length > 0 && (
                <div className="py-2">
                  <h3 className="text-center text-gray-700">Pick your size</h3>
                  {sizes.map((size) => (
                    <label
                      key={size._id}
                      className="flex items-center gap-2 p-4 border rounded-md mb-1 font-thin"
                    >
                      <input
                        type="radio"
                        name="size"
                        onClick={() => setSelectSize(size)}
                        checked={selectSize?.name === size.name}
                      />
                      {size.name} ${basePrice + size.price}
                    </label>
                  ))}
                </div>
              )}
              {extraIngredientPrices?.length > 0 && (
                <div className="py-2">
                  <h3 className="text-center text-gray-700">Any extras?</h3>
                  {extraIngredientPrices.map((extraThing) => (
                    <label
                      key={extraThing._id}
                      className="flex items-center gap-2 p-4 border rounded-md mb-1 font-thin"
                    >
                      <input
                        type="checkbox"
                        name={extraThing.name}
                        onClick={(ev) => handleExtras(ev, extraThing)}
                        checked={selectExtras
                          .map((e) => e._id)
                          .includes(extraThing._id)}
                      />
                      {extraThing.name} +${extraThing.price}
                    </label>
                  ))}
                </div>
              )}

              <div className="flying-button-parent">
                <FlyingButton
                  src="/menuimage.png"
                  targetTop={"5%"}
                  targetLeft={"77%"}
                >
                  <div
                    className="primary sticky bottom-2"
                    onClick={handleAddToCart}
                  >
                    Add to cart ${selectedPrice}
                  </div>
                </FlyingButton>
              </div>
              <button
                className="mt-2 rounded-full"
                onClick={() => setShowPopup(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <MenuItemBox onAddToCart={handleAddToCart} {...menuItem} />
    </>
  );
}
