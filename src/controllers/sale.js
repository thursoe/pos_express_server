const { catchAsyncError } = require("../middlewares");
const { SaleOrder, Stock, SaleOrderLine } = require("../models");
const { ErrorHandler } = require("../utils/ErrorHandler.js");
const { validateOrder } = require("../utils/validation/validation.js");

const index = catchAsyncError(async (_, res) => {
  try {
    const orders = await SaleOrder.find();

    res.status(200).json({ status: true, data: orders });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({
      message: "Some error occurred while retrieving the order.",
      errors: err.message,
    });
  }
});

const store = catchAsyncError(async (req, res) => {
  const data = await validateOrder(req.body);
  const order = new SaleOrder({ ...data, user: req.user.id });

  // update related stock value for each product
  let bulkOps = [];

  for (line of order.lines) {
    const lineDoc = new SaleOrderLine({
      orderId: order.id,
      ...line.toObject(),
    });

    await lineDoc.save();

    bulkOps.push({
      updateOne: {
        filter: { product: line.product },
        update: { $inc: { onHand: -line?.qty } },
        upsert: true,
      },
    });
  }

  await Stock.bulkWrite(bulkOps);
  await order.save();

  res.status(200).send({
    status: true,
    message: "SaleOrder created successfully!",
    data: [order],
  });
});

const show = catchAsyncError(async (req, res, next) => {
  const id = req.params.id;
  const order = await SaleOrder.findById(id);

  if (!order)
    return next(
      new ErrorHandler(
        `Cannot retrieve order with id:${id}. Maybe entry was not found!`,
        404
      )
    );

  res.status(200).json({ status: true, data: [order] });
});

const update = catchAsyncError(async (req, res, next) => {
  // TO DO: remove this fuction
  const id = req.params?.id;
  const updatedOrder = await validateOrder(req.body);
  const order = await SaleOrder.findByIdAndUpdate(id, updatedOrder);
  if (!order)
    return next(
      new ErrorHandler(
        `Cannot update order with id:${id}. Maybe entry was not found!`,
        404
      )
    );
  await order.save();
  res.status(200).send({ message: "SaleOrder updated successfully!" });
});

const destroy = catchAsyncError(async (req, res) => {
  // TO DO: remove this fuction
  const id = req.params?.id;
  await SaleOrder.findByIdAndDelete(id);
  res.send({
    message: "SaleOrder deleted successfully!",
  });
});

module.exports = { index, store, show, update, destroy };
