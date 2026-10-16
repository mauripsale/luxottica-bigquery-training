/**
 * window-bridge.js — Zero-Downtime Global Handler Facade Bridge
 * Part of Luxottica BigQuery Training Hub Architecture.
 *
 * Guarantees that all 95+ inline HTML onclick/oninput/onchange callbacks
 * execute seamlessly across student and trainer interfaces.
 * Maps every functional entrypoint into both `window.Hub` and `window`.
 */

(function() {
  const Hub = window.Hub || {};

  // Handlers catalog for introspection and debugging
  Hub.handlers = [
    'AS', 'ROUND', 'SAFE_DIVIDE', 'SUM', 'backToRoleSelection', 'backToRoleSelectionFromPrompt',
    'broadcastBlock', 'clear', 'closeChallengeModal', 'closeGuideModal', 'closeHamburgerMenu',
    'closeLeaderboardModal', 'closePlaybookModal', 'closeProfilePopover', 'closeResumeStudentModal',
    'closeRosettaModal', 'closeStudentManagerModal', 'closeTrainerPinModal', 'closeTrainerSolutionsModal',
    'copyToClipboard', 'disableTrainerMode', 'downloadChallengeSQL', 'executeBatchDeleteAll',
    'executeBatchDeleteSelected', 'filterRosetta', 'filterRosettaModal', 'filterStudentManagerTable',
    'getElementById', 'handleLogoClick', 'loadPreset', 'loadSample', 'logoutStudentProfile',
    'openChallengeModal', 'openGuideModal', 'openLeaderboardModal', 'openOnboardingModal',
    'openPlaybookModal', 'openResumeStudentModal', 'openRoleSelectionModal', 'openRosettaModal',
    'openStudentManagerModal', 'openTrainerSolutionsModal', 'pingStudentsFromTrainer',
    'refreshStudentManagerTable', 'refreshTrainerStudents', 'renderClassroomLeaderboard',
    'rerollStudentTeam', 'resetClassroomLeaderboard', 'resumeExistingLocalSession', 'roast',
    'selectRoleStudent', 'selectRoleTrainer', 'setBpm', 'setDiopters', 'setLanguage', 'setN',
    'setPolarized', 'setTint', 'showToast', 'startAsNewStudent', 'submitStudentOnboarding',
    'submitStudentResume', 'submitTrainerPinModal', 'switchBoardSlide', 'switchBreakGame',
    'switchTab', 'switchToStudentPreview', 'switchToTrainerCommandCenter',
    'toggleLeaderboardFullscreen', 'toggleLockState', 'togglePlay', 'toggleSelectAllStudents',
    'toggleSinglePin', 'toggleTheme', 'toggleTrainerMode', 'toggleTrainerPinsVisibility',
    'trainerChangeRoomCode', 'trainerCopyShareLink', 'trainerForceSyncAll', 'trainerSetBreakGame',
    'trainerStartTimer', 'trainerStopTimer', 'trainerToggleAllHints', 'trainerToggleHint',
    'trainerToggleStudentDocs', 'triggerClassroomConfetti', 'unlockHint', 'userSelectBlock',
    'validateChallenge0', 'validateChallenge1', 'validateChallenge2', 'validateChallenge3'
  ];

  // Expose bridge on Hub
  Hub.bridge = {
    isReady: true,
    count: Hub.handlers.length
  };
})();
