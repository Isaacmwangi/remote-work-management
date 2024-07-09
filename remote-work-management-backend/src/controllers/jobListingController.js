const { prisma } = require('../config/db');

const createJobListing = async (req, res) => {
  const { title, description, requirements, location } = req.body;
  const employerId = req.user.id;

  try {
    const jobListing = await prisma.jobListing.create({
      data: {
        title,
        description,
        requirements,
        location,
        employer_id: employerId
      }
    });

    res.status(201).json(jobListing);
  } catch (error) {
    res.status(500).json({ error: 'Error creating job listing' });
  }
};

const getJobListings = async (req, res) => {
  try {
    const jobListings = await prisma.jobListing.findMany();
    res.json(jobListings);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving job listings' });
  }
};

const getJobListingById = async (req, res) => {
  const { id } = req.params;

  try {
    const jobListing = await prisma.jobListing.findUnique({
      where: { id: parseInt(id) },
    });

    if (!jobListing) {
      return res.status(404).json({ message: 'Job listing not found' });
    }

    res.json(jobListing);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving job listing' });
  }
};

const updateJobListing = async (req, res) => {
  const { id } = req.params;
  const { title, description, requirements, location } = req.body;

  try {
    const jobListing = await prisma.jobListing.update({
      where: { id: parseInt(id) },
      data: { title, description, requirements, location }
    });

    res.json(jobListing);
  } catch (error) {
    res.status(500).json({ error: 'Error updating job listing' });
  }
};

const deleteJobListing = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.jobListing.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Job listing deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting job listing' });
  }
};

module.exports = {
  createJobListing,
  getJobListings,
  getJobListingById,
  updateJobListing,
  deleteJobListing,
};
