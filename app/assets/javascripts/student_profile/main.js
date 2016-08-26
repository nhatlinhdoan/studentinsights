$(function() {
  // only run if the correct page
  if (!($('body').hasClass('students') && $('body').hasClass('show'))) return;

  // imports
  var createEl = window.shared.ReactHelpers.createEl;
  var PageContainer = window.shared.PageContainer;
  var parseQueryString = window.shared.parseQueryString;

  // mixpanel analytics
  MixpanelUtils.registerUser(serializedData.currentEducator);
  MixpanelUtils.track('PAGE_VISIT', { page_key: 'STUDENT_PROFILE' });

  // entry point, reading static bootstrapped data from the page
  var serializedData = $('#serialized-data').data();
  ReactDOM.render(createEl(PageContainer, {
    nowMomentFn: function() { return moment.utc(); },
    serializedData: serializedData,
    queryParams: parseQueryString(window.location.search)
  }), document.getElementById('main'));
});
