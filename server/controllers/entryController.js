import Entry from "../models/Entry.js";
import Member from "../models/Member.js";

// ==========================================
// ADD ENTRY
// ==========================================

export const addEntry = async (req, res) => {
  try {
    const { memberId } = req.body;

    // Check member ID
    if (!memberId) {
      return res.status(400).json({
        success: false,
        message: "Member ID is required",
      });
    }

    // Check member exists
    const member = await Member.findById(memberId);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    // Check if member is already inside
    const existingEntry = await Entry.findOne({
      member: memberId,
      status: "inside",
    });

    if (existingEntry) {
      return res.status(400).json({
        success: false,
        message: "Member is already inside the club",
      });
    }

    // Create entry
    const entry = await Entry.create({
      member: memberId,
      entryDate: new Date(),
      entryTime: new Date(),
      status: "inside",
      createdBy: req.user.userId,
    });

    const populatedEntry = await Entry.findById(entry._id)
      .populate("member", "name email phone")
      .populate("createdBy", "name email role");

    res.status(201).json({
      success: true,
      message: "Member entry recorded successfully",
      entry: populatedEntry,
    });
  } catch (error) {
    console.error("ADD ENTRY ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// GET ALL ENTRIES
// ==========================================

export const getEntries = async (req, res) => {
  try {
    const entries = await Entry.find()
      .populate("member", "name email phone")
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: entries.length,
      entries,
    });
  } catch (error) {
    console.error("GET ENTRIES ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// GET SINGLE ENTRY
// ==========================================

export const getEntryById = async (req, res) => {
  try {
    const entry = await Entry.findById(req.params.id)
      .populate("member", "name email phone")
      .populate("createdBy", "name email role");

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: "Entry not found",
      });
    }

    res.status(200).json({
      success: true,
      entry,
    });
  } catch (error) {
    console.error("GET ENTRY ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// EXIT MEMBER
// ==========================================

export const exitMember = async (req, res) => {
  try {
    const entry = await Entry.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: "Entry not found",
      });
    }

    // Already exited
    if (entry.status === "exited") {
      return res.status(400).json({
        success: false,
        message: "Member has already exited",
      });
    }

    entry.exitTime = new Date();
    entry.status = "exited";

    await entry.save();

    const updatedEntry = await Entry.findById(entry._id)
      .populate("member", "name email phone")
      .populate("createdBy", "name email role");

    res.status(200).json({
      success: true,
      message: "Member exit recorded successfully",
      entry: updatedEntry,
    });
  } catch (error) {
    console.error("EXIT MEMBER ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// DELETE ENTRY
// ==========================================

export const deleteEntry = async (req, res) => {
  try {
    const entry = await Entry.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: "Entry not found",
      });
    }

    await Entry.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Entry deleted successfully",
    });
  } catch (error) {
    console.error("DELETE ENTRY ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
