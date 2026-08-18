import Member from "../models/Member.js";
import Entry from "../models/Entry.js";
import Payment from "../models/Payment.js";

// ==========================================
// DASHBOARD REPORT
// ==========================================

export const getDashboardReport = async (req, res) => {
  try {
    // Total members
    const totalMembers = await Member.countDocuments();

    // Active members
    const activeMembers = await Member.countDocuments({
      status: "active",
    });

    // Total entries
    const totalEntries = await Entry.countDocuments();

    // Currently inside members
    const currentlyInside = await Entry.countDocuments({
      status: "inside",
    });

    // Total successful payments
    const totalPayments = await Payment.countDocuments({
      status: "paid",
    });

    // Total revenue
    const revenueResult = await Payment.aggregate([
      {
        $match: {
          status: "paid",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$amount",
          },
        },
      },
    ]);

    const totalRevenue =
      revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    res.status(200).json({
      success: true,

      report: {
        totalMembers,
        activeMembers,
        totalEntries,
        currentlyInside,
        totalPayments,
        totalRevenue,
      },
    });
  } catch (error) {
    console.error("DASHBOARD REPORT ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// PAYMENT REPORT
// ==========================================

export const getPaymentReport = async (req, res) => {
  try {
    const payments = await Payment.find({
      status: "paid",
    })
      .populate("member", "name email phone")
      .sort({ paymentDate: -1 });

    const revenueResult = await Payment.aggregate([
      {
        $match: {
          status: "paid",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$amount",
          },
        },
      },
    ]);

    const totalRevenue =
      revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    res.status(200).json({
      success: true,
      count: payments.length,
      totalRevenue,
      payments,
    });
  } catch (error) {
    console.error("PAYMENT REPORT ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// ENTRY REPORT
// ==========================================

export const getEntryReport = async (req, res) => {
  try {
    const entries = await Entry.find()
      .populate("member", "name email phone")
      .sort({ entryTime: -1 });

    const insideCount = await Entry.countDocuments({
      status: "inside",
    });

    const exitedCount = await Entry.countDocuments({
      status: "exited",
    });

    res.status(200).json({
      success: true,

      count: entries.length,

      summary: {
        currentlyInside: insideCount,
        exited: exitedCount,
      },

      entries,
    });
  } catch (error) {
    console.error("ENTRY REPORT ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// MEMBER REPORT
// ==========================================

export const getMemberReport = async (req, res) => {
  try {
    const members = await Member.find()
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });

    const activeMembers = await Member.countDocuments({
      status: "active",
    });

    const inactiveMembers = await Member.countDocuments({
      status: "inactive",
    });

    res.status(200).json({
      success: true,

      count: members.length,

      summary: {
        activeMembers,
        inactiveMembers,
      },

      members,
    });
  } catch (error) {
    console.error("MEMBER REPORT ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
