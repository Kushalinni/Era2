export const JADVars = Object.freeze({
    title1: 'Job Advertisement Details',
    title2: 'Advertisement #',
    title3: 'Advertisement Info',
    title4: 'Applicant List',
    title5: 'Interview List',
    title6: 'History',
    title7: 'Job Purpose',
    title8: 'Job Profile Info',

    appList: '', // Applicant List  (HCBD HEAD, HCBO)
    iViewList: '',//  (HCBD HEAD, HCBO)
    hist: '',//  (HCBD HEAD, HCBO)
    chooseApp: '',//Choose applicant (HCBD)
    appDetail: '',//  (HCBD HEAD, HCBO)
    errNoData: '--- No Data ---',
    errLoadData: '[ERROR] Loading Data Failed.',

    advInfoById: '', // Get Advertisement Info  (HCBD HEAD, HCBO)
    jobProfById: '/jobAdv/get', // Get Job Profile Info  (HCBD HEAD, HCBO)
    actApprHCBD: '/jobAdv/approval/hcbd/edit', // Post approval by HCBD
    actApprHCBO: '/jobAdv/approval/hcbo/edit', // Post approval by HCBD

    // Applicant List Panel
    showPanelApplList: false, // show or hide panel based on advertisement status
    aplcAct: false, // hide or show select applicant function . show only if status=4 and isOwner=1
    aplcSubmit: false, // initial
    aplcStatus: false,
    btnCallIview: 'Call for Interview', // button label
    errNoApplicant: '--- Applicant List is Empty ---',
    selectApplicantForIviewAPI: '/jobAdvApply/hcbd/applicant/edit',
    getApplicantDetailsAPI: '/jobAdvApply/applicant/get',

    // Interview List Panel
    iviewPanel: false, // show or hide panel based on advertisement status
    iviewAct: false, // choose applicant from list and also submit button (multiple choose)
    iviewSubmit: false, // disable submit button if applicant selected <1
    iviewStatus: false,
    btnAcceptForPosition: 'Success Candidate',
    errNoIview: '--- Interview List is Empty ---',
    selectSuccessFromIviewAPI: '/jobAdvApply/hcbd/interview/edit',

    advExpDate: 'Advertisement start date has ended. Please update to proceed with the advertisement.',
    advExceedDate: 'Advertisement date range exceed 14 days limit.',
    advIsOccupied: 'This position is already OCCUPIED.',

    btnReSubmit: 'Resubmit',
    btnWithDraw: 'Withdraw',
    apiResubmit: '/jobAdv/resubmit'
}); 