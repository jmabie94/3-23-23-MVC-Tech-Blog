const router = require('express').Router();
const apiRoutes = require('./api');
const homeRoutes = require('./homeRoutes');
/* const dashboardRoutes = require('./dashboardRoutes');
const loginRoutes = require('./loginRoutes'); */

router.use('/api', apiRoutes);
router.use('/', homeRoutes);
// probably need to consolidate all non-api routes to homeRoutes
/* router.use('/dashboard', dashboardRoutes);
router.use('/login', loginRoutes); */

module.exports = router;