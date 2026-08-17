import Member from "../models/Member.js";

// ==========================================
// ADD MEMBER
// ==========================================

export const addMember = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      membershipType,
      membershipStartDate,
      membershipEndDate,
    } = req.body;

    // Required fields
    if (
      !name ||
      !email ||
      !phone ||
      !membershipStartDate ||
      !membershipEndDate
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    // Check existing member
    const existingMember = await Member.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingMember) {
      return res.status(400).json({
        success: false,
        message: "Member with this email or phone already exists",
      });
    }

    // Create member
    const member = await Member.create({
      name,
      email,
      phone,
      address,
      membershipType: membershipType || "monthly",
      membershipStartDate,
      membershipEndDate,
      createdBy: req.user.userId,
    });

    res.status(201).json({
      success: true,
      message: "Member added successfully",
      member,
    });
  } catch (error) {
    console.error("ADD MEMBER ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// GET ALL MEMBERS
// ==========================================

export const getMembers = async (req, res) => {
  try {
    const members = await Member.find()
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: members.length,
      members,
    });
  } catch (error) {
    console.error("GET MEMBERS ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// GET SINGLE MEMBER
// ==========================================

export const getMemberById = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id).populate(
      "createdBy",
      "name email role",
    );

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    res.status(200).json({
      success: true,
      member,
    });
  } catch (error) {
    console.error("GET MEMBER ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// UPDATE MEMBER
// ==========================================

export const updateMember = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    const {
      name,
      email,
      phone,
      address,
      membershipType,
      membershipStartDate,
      membershipEndDate,
      status,
    } = req.body;

    member.name = name ?? member.name;
    member.email = email ?? member.email;
    member.phone = phone ?? member.phone;
    member.address = address ?? member.address;
    member.membershipType = membershipType ?? member.membershipType;
    member.membershipStartDate =
      membershipStartDate ?? member.membershipStartDate;
    member.membershipEndDate = membershipEndDate ?? member.membershipEndDate;
    member.status = status ?? member.status;

    await member.save();

    res.status(200).json({
      success: true,
      message: "Member updated successfully",
      member,
    });
  } catch (error) {
    console.error("UPDATE MEMBER ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// DELETE MEMBER
// ==========================================

export const deleteMember = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    await Member.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Member deleted successfully",
    });
  } catch (error) {
    console.error("DELETE MEMBER ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
