const inventoryModel = require("../models/inventoryModel")
const classificationModel = require("../models/classificationModel")

const inventoryController = {}

inventoryController.buildInventory = async (req, res, next) => {
  try {
    const { id } = req.params
    const vehicle = await inventoryModel.getVehicleById(id)
    const classifications = await classificationModel.getAll()

    if (!vehicle) {
      req.flash("error", "Vehicle not found.")
      return res.redirect("/inventory")
    }

    const title = `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`
    const isAuth = res.locals.loggedin
    return res.render("inventory", {
      title,
      isAuth,
      vehicle,
      classifications,
    })
  } catch (error) {
    return next(error)
  }
}

inventoryController.buildManagement = async (req, res, next) => {
  try {
    const [classifications, inventoryList] = await Promise.all([
      classificationModel.getAll(),
      inventoryModel.getAllWithClassification(),
    ])

    return res.render("inventory-management", {
      title: "Inventory Management",
      classifications,
      inventoryList,
    })
  } catch (error) {
    return next(error)
  }
}

inventoryController.buildAddClassification = async (req, res, next) => {
  try {
    const classifications = await classificationModel.getAll()

    return res.render("inventory-add-classification", {
      title: "Add Classification",
      classifications,
      formData: { classification_name: "" },
      errors: [],
    })
  } catch (error) {
    return next(error)
  }
}

inventoryController.createClassification = async (req, res, next) => {
  try {
    const name = req.body.classification_name
      ? req.body.classification_name.trim()
      : ""

    if (!name) {
      const classifications = await classificationModel.getAll()
      return res.status(400).render("inventory-add-classification", {
        title: "Add Classification",
        classifications,
        formData: { classification_name: req.body.classification_name || "" },
        errors: ["Classification name is required."],
      })
    }

    await classificationModel.createClassification(name)
    req.flash("success", "Classification added successfully.")
    return res.redirect("/inventory/add-classification")
  } catch (error) {
    if (error.code === "23505") {
      const classifications = await classificationModel.getAll()
      return res.status(400).render("inventory-add-classification", {
        title: "Add Classification",
        classifications,
        formData: { classification_name: req.body.classification_name },
        errors: ["That classification already exists."],
      })
    }
    return next(error)
  }
}

inventoryController.buildAddInventory = async (req, res, next) => {
  try {
    const classifications = await classificationModel.getAll()

    return res.render("inventory-add-inventory", {
      title: "Add Inventory",
      classifications,
      formData: {},
      errors: [],
    })
  } catch (error) {
    return next(error)
  }
}

inventoryController.createInventory = async (req, res, next) => {
  const formData = { ...req.body }
  const requiredFields = [
    "classification_id",
    "inv_make",
    "inv_model",
    "inv_year",
    "inv_description",
    "inv_image",
    "inv_thumbnail",
    "inv_price",
    "inv_miles",
    "inv_color",
  ]
  const fieldLabels = {
    classification_id: "Classification",
    inv_make: "Make",
    inv_model: "Model",
    inv_year: "Year",
    inv_description: "Description",
    inv_image: "Image path",
    inv_thumbnail: "Thumbnail path",
    inv_price: "Price",
    inv_miles: "Miles",
    inv_color: "Color",
  }

  const errors = requiredFields
    .filter((field) => !formData[field] || !String(formData[field]).trim())
    .map((field) => `${fieldLabels[field]} is required.`)

  const parsedInventory = {
    classification_id: Number(formData.classification_id),
    inv_make: formData.inv_make?.trim(),
    inv_model: formData.inv_model?.trim(),
    inv_year: formData.inv_year?.trim(),
    inv_description: formData.inv_description?.trim(),
    inv_image: formData.inv_image?.trim(),
    inv_thumbnail: formData.inv_thumbnail?.trim(),
    inv_price: Number(formData.inv_price),
    inv_miles: Number(formData.inv_miles),
    inv_color: formData.inv_color?.trim(),
  }

  if (Number.isNaN(parsedInventory.classification_id)) {
    errors.push("Classification selection is invalid.")
  }

  if (Number.isNaN(parsedInventory.inv_price)) {
    errors.push("Price must be a valid number.")
  }

  if (Number.isNaN(parsedInventory.inv_miles)) {
    errors.push("Miles must be a valid number.")
  }

  if (parsedInventory.inv_year) {
    if (parsedInventory.inv_year.length !== 4) {
      errors.push("Year must be four characters (YYYY).")
    }
    if (!/^\d{4}$/.test(parsedInventory.inv_year)) {
      errors.push("Year must contain only numbers.")
    }
  }

  if (errors.length) {
    try {
      const classifications = await classificationModel.getAll()
      return res.status(400).render("inventory-add-inventory", {
        title: "Add Inventory",
        classifications,
        formData,
        errors,
      })
    } catch (error) {
      return next(error)
    }
  }

  try {
    await inventoryModel.createInventory(parsedInventory)
    req.flash("success", "Inventory item added successfully.")
    return res.redirect("/inventory")
  } catch (error) {
    if (error.code === "23503") {
      const classifications = await classificationModel.getAll()
      return res.status(400).render("inventory-add-inventory", {
        title: "Add Inventory",
        classifications,
        formData,
        errors: ["Invalid classification selection. Please try again."],
      })
    }
    return next(error)
  }
}

inventoryController.deleteInventory = async (req, res, next) => {
  try {
    const {id} = req.params
    console.log(res.locals.loggedin, id)
    if (res.locals.loggedin && id) {
      const result = await inventoryModel.deleteInventoryItem(id)
      req.flash("notice", "Item has been deleted.")
      return res.redirect("/inventory")
    }
    else {
      throw new Error('Invalid id')
    }
  } catch (error) {
    console.log(error.message)
    return next(error)
  }
}

module.exports = inventoryController
