import { dom } from "./dom.js";
import { views } from "./views.js";
import { models } from "./models.js";

export const controls = { };

const textControl = (view, intent) => {
  view.textContent = intent;
  return view;
}

controls.error = intent => 
  textControl(views.error(), intent.message);

controls.field = intent => 
  intent.error.test(intent.message) 
    ? textControl(views.muted(), intent.message)
    : textControl(views.normal(), intent.message);

controls.badge = intent => 
  intent.error.test(intent.message) 
    ? textControl(views.redBadge(), intent.message)
    : textControl(views.blueBadge(), intent.message);

controls.results = intent => {
  const view = views.resultsList();
  view.children = intent.data.items
    .map(result => controls.resultData({data: result, onItemClick: intent.onItemClick}));
  return view;
};

controls.resultData = intent => {
  const model = models.resultData(intent.data);
  const view = views.resultData();
  const tags = dom.query(view, {
    name: ".ll-result-name",
    thumbnailImage: ".ll-result-image",
    salePrice: ".ll-result-price .ll-value",
    stock: ".ll-result-stock .ll-value"
  });
  
  tags.thumbnailImage.src = model.thumbnailImage;
  tags.name.child =  controls.field({message: model.name, error: /---/g});
  tags.salePrice.child = controls.field({message: model.salePrice, error: /N\/A/g});
  tags.stock.child = controls.badge({message: model.stock, error: /(.*NO.*)|(N\/A)/gi});

  view.addEventListener("click", () => intent.onItemClick(model.upc));
  return view;
};

controls.itemData = intent => {
  const model = models.itemData(intent);
  const view = views.itemData();
  const tags = dom.query(view, {
    thumbnailImage: ".ll-item-image",
    shortDescription: ".ll-item-description",
    barcode: ".ll-item-barcode",
    name: ".ll-item-name .ll-value",
    upc: ".ll-item-upc .ll-value",
    salePrice: ".ll-item-price .ll-value",
    stock: ".ll-item-stock .ll-value",
    categoryPath: ".ll-item-category .ll-value"
  });

  tags.thumbnailImage.src = model.thumbnailImage;
  
  tags.shortDescription.child = controls.field({message: model.shortDescription, error: /---/g});
  tags.name.child = controls.field({message: model.name, error: /---/g});
  tags.upc.child = controls.field({message: model.upc, error: /00000000000/g});
  tags.salePrice.child = controls.field({message: model.salePrice, error: /N\/A/g});
  tags.categoryPath.child = controls.field({message: model.categoryPath, error: /N\/A/g});
  tags.stock.child = controls.badge({message: model.stock, error: /(.*NO.*)|(N\/A)/gi});
  
  JsBarcode(tags.barcode, model.upc, { format: "upc", valid() { return true; } });
  tags.barcode.removeAttributeNS(null, "width");
  tags.barcode.removeAttributeNS(null, "height");
  return view;
};