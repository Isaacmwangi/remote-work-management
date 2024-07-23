// Final_Project/remote-work-management-backend/src/controllers/applicationController.js
const { prisma } = require("../config/db");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: process.env.GMAIL_USER,
		pass: process.env.GMAIL_PASS,
	},
});

// Apply for Job
const applyForJob = async (req, res) => {
	const { jobId } = req.params;
	const userId = req.user.id;

	try {
		const jobListing = await prisma.jobListing.findUnique({ where: { id: parseInt(jobId) } });

		if (!jobListing) {
			return res.status(404).json({ message: "Job listing not found" });
		}

		const existingApplication = await prisma.application.findFirst({
			where: { job_id: parseInt(jobId), job_seeker_id: userId },
		});

		if (existingApplication) {
			return res.status(400).json({ message: "Already applied for this job" });
		}

		const user = await prisma.user.findUnique({ where: { id: userId } });

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		const application = await prisma.application.create({
			data: {
				job_id: parseInt(jobId),
				job_seeker_id: userId,
				status: "Pending",
				applied_on: new Date(),
				resume: user.resume,
			},
		});

		const job = await prisma.jobListing.findUnique({
			where: { id: parseInt(jobId) },
			include: { employer: true },
		});

		if (job && job.employer) {
			const mailOptions = {
				from: process.env.GMAIL_USER,
				to: job.employer.email,
				subject: "New Job Application",
				text: `User ${user.email} has applied for the job "${job.title}".`,
			};

			transporter.sendMail(mailOptions, (error, info) => {
				if (error) {
					console.error("Error sending email:", error);
				}
			});
		}

		res.status(201).json(application);
	} catch (error) {
		console.error('Error applying for job:', error);
		res.status(500).json({ error: "Error applying for job" });
	}
};

// Get all Applications
const getApplications = async (req, res) => {
	try {
		const applications = await prisma.application.findMany({
			include: {
				jobListing: true,
				jobSeeker: true,
			}
		});
		res.json(applications);
	} catch (error) {
		res.status(500).json({ error: "Error retrieving applications" });
	}
};

// Get Applications by Job
const getApplicationsByJob = async (req, res) => {
	const { jobId } = req.params;

	try {
		const applications = await prisma.application.findMany({
			where: { job_id: parseInt(jobId) },
			include: { jobSeeker: true },
		});
		res.json(applications);
	} catch (error) {
		res.status(500).json({ error: "Error retrieving applications" });
	}
};

// Get Application by ID
const getApplicationById = async (req, res) => {
	const { id } = req.params;

	try {
		const application = await prisma.application.findUnique({
			where: { id: parseInt(id) },
			include: { jobSeeker: true },
		});

		if (!application) {
			return res.status(404).json({ message: "Application not found" });
		}

		res.json(application);
	} catch (error) {
		res.status(500).json({ error: "Error retrieving application" });
	}
};

// Update Application
const updateApplicationsByJob = async (req, res) => {
	const { id } = req.params;
	const { status } = req.body;
	const userId = req.user.id;

	try {
		const application = await prisma.application.findUnique({
			where: { id: parseInt(id) },
		});

		if (!application) {
			return res.status(404).json({ message: "Application not found" });
		}

		if (application.job_seeker_id !== userId) {
			return res.status(403).json({ message: "Not authorized to update this application" });
		}

		const updatedApplication = await prisma.application.update({
			where: { id: parseInt(id) },
			data: { status },
		});

		res.json(updatedApplication);
	} catch (error) {
		res.status(500).json({ error: "Error updating application" });
	}
};

// Delete Application
const deleteApplication = async (req, res) => {
	const { id } = req.params;
	const userId = req.user.id;

	try {
		const application = await prisma.application.findUnique({
			where: { id: parseInt(id) },
		});

		if (!application) {
			return res.status(404).json({ message: "Application not found" });
		}

		if (application.job_seeker_id !== userId) {
			return res.status(403).json({ message: "Not authorized to delete this application" });
		}

		await prisma.application.delete({ where: { id: parseInt(id) } });

		res.json({ message: "Application deleted successfully" });
	} catch (error) {
		res.status(500).json({ error: "Error deleting application" });
	}
};

module.exports = {
	applyForJob,
	getApplications,
	getApplicationsByJob,
	getApplicationById,
	updateApplicationsByJob,
	deleteApplication,
};
