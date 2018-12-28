// import optional

function saveModel(model) {
  document.cookie = new Either(model)
   .then((x) => JSON.stringify(x))
   .getOrElse("{}");
}

function loadModel(model) {
  return new Either(document.cookie)
   .then((x) => JSON.parse(x))
   .getOrElse({});
}

const getItemName = (item) => (new Optional(item))
  .map((x) => x.name)
  .getOrElse("---");

const getItemThumbnail = (item) => (new Optional(item))  
  .map((x) => x.images)
  .map((x) => x.thumbnailUrl)
  .getOrElse("https://via.placeholder.com/64?text=?");

const getItemImage = (item) => (new Optional(item))
  .map((x) => x.images)
  .map((x) => x.largeUrl)
  .getOrElse("https://via.placeholder.com/64?text=?");

const getItemUPC = (item) => (new Optional(item))
  .map((x) => x.productId)
  .map((x) => x.upc)
  .map((x) => x.length < 11 ? "0".repeat(11 - x.length) + x : x)
  .map((x) => x.length > 12 ? x.substring(0, 11) : x)
  .getOrElse("00000000000");

const getItemDepartment = (item) => (new Optional(item))
  .map((x) => x.department)
  .filter((x) => x.storeDeptId !== -1)
  .map((x) => x.name)
  .getOrElse("N/A");

const getItemPrice = (item) => (new Optional(item))
  .map((x) => x.price)
  .filter((x) => x.currencyUnit !== "USD")
  .map((x) => x.priceInCents)
  .map((x) => "$" + (x/100 | 0) + "." + (x % 100))
  .getOrElse("N/A");

const getItemStock = (item) => (new Optional(item))
  .map((x) => x.inventory)
  .map((x) => x.quantity)
  .map((x) => x + "*")
  .getOrElse("N/A");

const getItemLocation = (item) => (new Optional(item.location))
  .map((x) => x.detailed)  
  .filter((x) => x.length !== 0)
  .map((x) => x.map((y) => y.zone + y.aisle + "-" + y.section).join(", "))
  .getOrElse("N/A");