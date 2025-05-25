export const OVERFLOW_HIDDEN = '_overflow-hidden'

// css vars
export const VAR_PADDING_RIGHT = '--padding-right'
export const VAR_PADDING_RIGHT_PX = '--padding-right-px'

// custom event listeners
export const CUSTOM_EVENT_APP_INITIALIZED = 'appInitialized'
export const CUSTOM_EVENT_OPTIMIZED_RESIZE = 'optimizedResize'
export const CUSTOM_EVENT_OPTIMIZED_SCROLL = 'optimizedScroll'
export const CUSTOM_EVENT_ESCAPE_KEYDOWN = 'escape'

//-- не использовать эти события, вместо них использовать событие CUSTOM_EVENT_OPTIMIZED_RESIZE
export const CUSTOM_EVENT_BREAKPOINT_SM_CHANGE = 'breakpointSmChange'
export const CUSTOM_EVENT_BREAKPOINT_MD_CHANGE = 'breakpointMdChange'
export const CUSTOM_EVENT_BREAKPOINT_LG_CHANGE = 'breakpointLgChange'
export const CUSTOM_EVENT_BREAKPOINT_XL_CHANGE = 'breakpointXlChange'
export const CUSTOM_EVENT_BREAKPOINT_XXL_CHANGE = 'breakpointXxlChange'
//--

export const CUSTOM_EVENT_CLOSE = 'close'
export const CUSTOM_EVENT_OPEN = 'open'
export const CUSTOM_EVENT_ARROW_LEFT_KEYDOWN = 'arrowLeft'
export const CUSTOM_EVENT_ARROW_RIGHT_KEYDOWN = 'arrowRight'
export const CUSTOM_EVENT_ALT_ZOOM_CHANGE = 'altZoomChange'
export const CUSTOM_EVENT_ALT_EFFECTS_CHANGE = 'altEffectsChange'
export const CUSTOM_EVENT_ALT_IMAGES_CHANGE = 'altImagesChange'
export const CUSTOM_EVENT_ALT_COLOR_CHANGE = 'altColorChange'
export const CUSTOM_EVENT_FANCYBOX_SLIDE_CHANGE = 'fancyboxSlideChange'
export const CUSTOM_EVENT_ASYNC_INIT_COLLAPSE_TAGS = 'asyncInitCollapseTags'
export const CUSTOM_EVENT_SUBMIT_FORM_FILTERS = 'submitFormFilters'
export const CUSTOM_EVENT_DROPDOWN_OPEN = 'dropdownOpen'
export const CUSTOM_EVENT_DROPDOWN_CLOSE = 'dropdownClose'
export const CUSTOM_EVENT_HELLO_IS_UPDATED = 'helloIsUpdated'
export const CUSTOM_EVENT_HELLO_IS_INIT = 'helloIsInit'
export const CUSTOM_EVENT_HANDLE_CLOSE = 'handleClose'
export const CUSTOM_EVENT_HANDLE_OPEN = 'handleOpen'
export const CUSTOM_EVENT_FORM_SEND_SUCCESS = 'formSendSuccess'
export const CUSTOM_EVENT_SET_FOCUS_IN_MODAL = 'handleSetFocusInModal'
export const CUSTOM_EVENT_TEL_COUNTRIES_IS_INIT = 'telCountriesIsInit'

export const LOADED_CLASS = '_loaded'
export const NO_WEBP_CLASS = '_no-webp'
export const WEBP_CLASS = '_webp'
export const IS_IOS_CLASS = '_is-ios'
export const IS_FIREFOX_CLASS = '_is-firefox'

// breakpoints
export const MEDIA_BREAKPOINT_SM = {
  name: 'sm',
  value: 0,
}
export const MEDIA_BREAKPOINT_MD = {
  name: 'md',
  value: 768,
}
export const MEDIA_BREAKPOINT_LG = {
  name: 'lg',
  value: 1280,
}
export const MEDIA_BREAKPOINT_XL = {
  name: 'xl',
  value: 1600,
}
export const MEDIA_BREAKPOINT_XXL = {
  name: 'xxl',
  value: 1920,
}

export const OPEN_CLASS_NAME = '_open'
export const HIDDEN_CLASS_NAME = '_hidden'
export const ACTIVE_CLASS_NAME = '_active'
export const SCROLL_CLASS_NAME = '_scroll'
export const SCROLL_DOWN_CLASS_NAME = '_scroll-down'
export const PAUSED_CLASS_NAME = '_paused'

export const DATA_EVENT = 'data-event'

// alt
export const ALTERNATIVE_VERSION_MENU_CLASS = 'js-alternative-version-menu'
export const ALTERNATIVE_VERSION_MENU_TOGGLE_CLASS = 'js-alternative-version-menu__toggle'
export const ALTERNATIVE_VERSION_MENU_CONTENT_CLASS = 'js-alternative-version-menu__content'
export const HEADER_ALT_ZOOM_LEVELS = [100, 125, 150, 175, 200]
export const HEADER_ALT_SET_ZOOM_CLASS_NAME = 'js-header-alternative__set-zoom'
export const HEADER_ALT_EFFECTS_CLASS_NAME = 'js-header-alternative__effects'
export const HEADER_ALT_RESET_CLASS_NAME = 'js-header-alternative__reset'
export const HEADER_ALT_SET_IMAGES_CLASS_NAME = 'js-header-alternative__set-images'
export const HEADER_ALT_SET_COLOR_CLASS_NAME = 'js-header-alternative__set-color'

// aria attributes
export const ARIA_EXPANDED = 'aria-expanded'
export const DATA_ARIA_EXPANDED = 'data-aria-expanded'
export const ARIA_CONTROLS = 'aria-controls'
export const DATA_ARIA_CONTROLS = 'data-aria-controls'
export const ARIA_DISABLED = 'aria-disabled'
export const ARIA_LABEL = 'aria-label'
export const ARIA_LABELLEDBY = 'aria-labelledby'
export const ARIA_HIDDEN = 'aria-hidden'
export const ARIA_ROLE = 'role'
export const ARIA_MODAL = 'aria-modal'
export const ARIA_INVALID = 'aria-invalid'
export const ARIA_DESCRIBEDBY = 'aria-describedby'

export const COLLAPSED_CLASS_NAME = '_collapsed'
export const DATA_COLLAPSE_CONTAINER_HEIGHT = 'data-height'
export const DATA_OPEN = 'data-open'
export const DATA_NATIVE_ACTION = 'data-native-action'
export const ERROR_CLASS_NAME = '_error'
export const LOADING_CLASS_NAME = '_loading'
export const SUCCESS_CLASS_NAME = '_success'
export const DATA_ARIA_DESCRIBEDBY = 'data-aria-describedby'
export const DATA_ERROR_MESSAGE = 'data-error-message'
export const DATA_MIN_NUM_ERROR_MESSAGE = 'data-min-num-error-message'
export const DATA_MAX_NUM_ERROR_MESSAGE = 'data-max-num-error-message'
export const DATA_STEP_NUM_ERROR_MESSAGE = 'data-step-num-error-message'
export const DATA_MAX_FILE_COUNT_ERROR_MESSAGE = 'data-max-file-count-error-message'
export const DATA_FILE_SIZE_ERROR_MESSAGE = 'data-max-file-size-error-message'
export const DATA_FILE_ACCEPT_ERROR_MESSAGE = 'data-max-file-accept-error-message'
export const DATA_FILE_COUNT_MESSAGE = 'data-file-count-message'
export const DISABLED_CLASS_NAME = '_disabled'
export const FILLED_CLASS_NAME = '_filled'
export const OPEN_ALT_MENU_CLASS_NAME = '_open-alt-menu'
export const DATA_ZOOM = 'data-zoom'
export const DATA_NO_EFFECTS = 'data-no-effects'
export const DATA_IMAGES = 'data-images'
export const DATA_COLOR = 'data-color'
export const DATA_ARIA_LABEL = 'data-aria-label'
export const DATA_THEME = 'data-theme'
export const DATA_RESIZE = 'data-resize'
export const DATA_USE_CLIPBOARD = 'data-use-clipboard'
export const DATA_DRAG_SCOPED = 'data-drag-scoped'
export const DATA_MAX_FILE_SIZE = 'data-max-file-size'
export const DATA_MAX_FILE_COUNT = 'data-max-file-count'
export const DRAG_OVER_CLASS_NAME = '_drag-over'
export const DATA_ID = 'data-id'

// local storage
export const LOCAL_STORAGE_ZOOM_KEY = 'altZoomValue'
export const LOCAL_STORAGE_EFFECTS_KEY = 'altEffectsValue'
export const LOCAL_STORAGE_COLOR_KEY = 'altColorValue'
export const LOCAL_STORAGE_IMAGES_KEY = 'altImagesValue'

// header
export const MENU_TOGGLER_CLASS_NAME = 'js-menu-toggler'

export const DATA_INTL_DIAL_CODE = 'data-intl-dial-code'
export const DATA_INTL_ISO = 'data-intl-iso'
export const FORM_INPUT_BUTTON_MINUS_CLASS = 'js-input__button-minus'
export const FORM_INPUT_BUTTON_PLUS_CLASS = 'js-input__button-plus'
export const FORM_INPUT_BUTTONS_CLASS = 'js-input__buttons'
export const FORM_INPUT_CLEAR_CLASS = 'js-input__clear'
export const FORM_INPUT_ERROR_MESSAGE_CLASS = 'js-input__error-message'
export const FORM_INPUT_INPUT_CLASS = 'js-input__input'
export const FORM_INPUT_LABEL_CLASS = 'js-input__label'
export const INPUTMASK_CLASS_NAME = 'js-inputmask'
export const INTL_TEL_INPUT_CLASS_NAME = 'js-intl-tel-input'

// form
export const FORM_CLASS = 'js-form'
export const FORM_INPUT_CLASS = 'js-input'
export const FORM_PRELOADER_CLASS = 'js-form-common-preloader'
export const FORM_PRELOADER_ERROR_MESSAGE_TITLE_CLASS = 'js-form-common-preloader__error-message__title'
export const FORM_PRELOADER_ERROR_MESSAGE_TEXT_CLASS = 'js-form-common-preloader__error-message__text'
export const FORM_PRELOADER_SUCCESS_MESSAGE_TITLE_CLASS = 'js-form-common-preloader__success-message__title'
export const FORM_PRELOADER_SUCCESS_MESSAGE_TEXT_CLASS = 'js-form-common-preloader__success-message__text'
export const FORM_PRELOADER_CLOSE_BTN_CLASS = 'js-form-common-preloader__close'
export const FORM_HIDDEN_INPUT = 'js-hidden-input'
export const DATA_REDIRECT_URL_WITHOUT_AJAX = 'data-redirect-url-without-ajax'
export const DATA_POPUP_ID = 'data-popup-id'
export const DATA_REDIRECT_URL_IS_PATH = 'data-redirect-url-is-path'
export const REMOVE_SELECTION_STYLE_IN_FIREFOX = '_remove-selection-style-in-firefox'
export const DATA_SUCCESS_WITHOUT_RESET_FORM = 'data-success-without-reset-form'

// file input
export const FILE_DROPZONE_CLASS = 'js-dropzone'
export const FILE_DROPZONE_INPUT_CLASS = 'js-dropzone__input'
export const FILE_DROPZONE_DELETE_FILE_CLASS = 'js-dropzone__file-delete'
export const FILE_DROPZONE_FILE_CLASS = 'js-dropzone__file'
export const FILE_DROPZONE_LIST_CLASS = 'js-dropzone__list'
export const FILE_DROPZONE_CAPTION_CLASS = 'js-dropzone__caption'

export const DATEPICKER_COMPONENT = 'js-datepicker'
export const DATEPICKER_COMPONENT_INPUT = 'js-datepicker__input'

export const MULTISELECT_COMPONENT = 'js-multiselect'
export const MULTISELECT_COMPONENT_INPUT = 'js-multiselect__input'
export const MULTISELECT_COMPONENT_SELECT = 'js-multiselect__select'
export const MULTISELECT_COMPONENT_CLEAR = 'js-multiselect__clear'
export const MULTISELECT_COMPONENT_SUBMIT = 'js-multiselect__submit'

// checkbox group
export const CHECKBOX_GROUP_CLASS = 'js-checkbox-group'
export const CHECKBOX_GROUP_INPUT_CLASS = 'js-checkbox-group__input'
export const DATA_ADD_CLASS_TO_FORM = 'data-add-class-to-form'
export const DATA_REMOVE_CLASS_FROM_FORM = 'data-remove-class-from-form'

// rating
export const RATING_ROW = 'js-rating-row'
export const RATING_STAR = 'js-rating-star'
export const RATING_STAR_RADIO = 'js-rating-radio'
export const DATA_FOCUS_FIRST_INVISIBLE = '_focus-first-invisible'
export const DATA_FOCUS_VISIBLE_ADDED = 'data-focus-visible-added'
export const RATING_LOCAL_STORAGE_CLOSED_KEY = 'ratingClosedIds'
export const RATING_LOCAL_STORAGE_DONE_KEY = 'ratingDoneIds'

export const NUMBER_INPUT_CLASS = 'js-number-input'

export const DATA_INIT = 'data-init'

export const DATA_PLACEHOLDER = 'data-placeholder'
export const DATA_LABEL_FIELD = 'data-label-field'
export const DATA_VALUE_FIELD = 'data-value-field'
export const DATA_HINT_FIELD = 'data-hint-field'
export const DATA_LINK_FIELD = 'data-link-field'
export const DATA_URL = 'data-url'
export const DATA_OPTION_WITH_HINT = 'data-option-with-hint'
export const DATA_GROUP_LABEL_FIELD = 'data-group-label-field'
export const DATA_GROUP_VALUE_FIELD = 'data-group-value-field'
export const DATA_GROUP_FIELD = 'data-group-field'
export const DATA_WITH_GROUPS = 'data-with-groups'
export const DATA_OPTION_IS_LINK = 'data-option-is-link'
export const DATA_HIGHLIGHT = 'data-highlight'
export const DATA_WITH_SEARCH_INPUT = 'data-with-search-input'
export const DATA_LABEL = 'data-label'
export const FOCUS_CLASSNAME = '_focus'
export const DATA_PRELOAD_DATA = 'data-preload-data'

export const DATEPICKER_COMPONENT_ALT_INPUT = 'js-datepicker__alt-input'
export const DATA_DATE_FORMAT_TO_SHOW = 'data-date-format-to-show'
export const DATA_DATE_FORMAT_TO_SHOW_DAYJS = 'data-date-format-to-show-dayjs'
export const DATA_DATE_FORMAT_TO_SERVER = 'data-date-format-to-server'
export const DATA_DATE_INIT_FROM_QUERY = 'data-date-init-from-query'
export const DATA_DISABLED_TO_TODAY = 'data-disabled-to-today'
export const DATA_DISABLED_FROM_TODAY = 'data-disabled-from-today'
export const DATA_DATE_FROM_FIELD_NAME = 'data-date-from-field-name'
export const DATA_DATE_TO_FIELD_NAME = 'data-date-to-field-name'
export const DATA_DP_FROM_NAME = 'data-dp-from-name'
export const DATA_DP_TO_NAME = 'data-dp-to-name'
export const DATA_DP_EXTRA_CONFIG = 'data-dp-extra-config'
export const DATA_DP_AVAILABLE_DATES = 'data-dp-available-dates'
export const DATE_FORMAT = 'YYYY-MM-DD'
export const EMPTY_CLASS_NAME = '_empty'

//tabs
export const COMMON_TABS_CLASS = 'js-tabs'
export const COMMON_TABS_BTN_CLASS = 'js-tabs__btn'
export const COMMON_TABS_CONTENT_CLASS = 'js-tabs__content'
export const DATA_PARENT_ID = 'data-parent-id'
export const DATA_INIT_FROM_QUERY = 'data-init-from-query'
export const DATA_ACTIVE_TAB = 'data_active_tab'
export const DATA_SCROLL_INTO_VIEW = 'data-scroll-into-view'
export const DATA_SCROLL_INTO_VIEW_BLOCK = 'data-scroll-into-view-block'
export const DATA_SCROLL_INTO_VIEW_INLINE = 'data-scroll-into-view-inline'

// collapse
export const COMMON_COLLAPSE_CLASS = 'js-common-collapse'
export const COMMON_COLLAPSE_ITEM_CLASS = 'js-common-collapse__item'
export const COMMON_COLLAPSE_ITEM_TOGGLE_BTN_CLASS = 'js-common-collapse__item__toggle-btn'
export const COMMON_COLLAPSE_ITEM_CLOSE_BTN_CLASS = 'js-common-collapse__item__close-btn'
export const COMMON_COLLAPSE_ITEM_TOGGLE_CONTAINER_CLASS = 'js-common-collapse__item__toggle-container'
export const DATA_COLLAPSE_EXPAND_ONE = 'data-collapse-expand-one'

// popup
export const DATA_MODAL = 'data-modal'
export const POPUP_BTN_CLOSE_CLASS = 'js-popup__close'
export const POPUP_CLASS = 'js-popup'
export const ERROR_POPUP_CLASS = '_errorred'
export const MESSAGE_POPUP_ID = 'popup_message'
export const POPUP_CONTENT_SELECTOR = 'js-popup-content'
export const BODY_MENU_OPENED_CLASS_NAME = '_menu-opened'
export const POPUP_DYNAMIC_CONTENT_CLASS = 'js-popup__dynamic-content'

// paginaton
export const PAGINATION_COMMON_CLASS = 'js-pagination-common'
export const PAGINATION_COMMON_ITEM_CLASS = 'js-pagination-common__item'
export const PAGINATION_COMMON_SHOW_MORE_CLASS = 'js-pagination-common__show-more'
export const DATA_PAGES = 'data-pages'
export const DATA_PAGE = 'data-page'
export const PAGINATION_COMMON_WRAP_CLASS = 'js-pagination-common__wrap'
export const PAGINATION_COMMON_PLACEHOLDER_CLASS = 'js-pagination-common__placeholder'
export const DATA_NOT_CREATE_PAGES = 'data-not-create-pages'

//up btn
export const BTN_UP_VISIBILITY_THRESHOLD_VALUE = 100
export const BTN_UP_VISIBILITY_CLASS = '_visible'
export const BTN_UP_VISIBILITY_BODY_CLASS = '_btn-up-visible'
export const BTN_UP_SELECTOR = '#btn-up'

// video
export const COMMON_VIDEO_WRAP_CLASS = 'js-common-video'
export const COMMON_VIDEO_CLASS = 'js-common-video__video'
export const COMMON_VIDEO_PLAY_BTN_CLASS = 'js-common-video__play'

// vue
export const VUE_CONTAINER_CLASS_NAME = 'js-vue'

// dropdown
export const DROPDOWN_CLASS_NAME = 'js-dropdown'
export const DROPDOWN_BTN_CLASS_NAME = 'js-dropdown__btn'
export const DROPDOWN_CONTENT_CLASS_NAME = 'js-dropdown__content'

// filters
export const FILTER_FORM_CLASS = 'js-filter-form'
export const FILTER_FORM_WRAP_CLASS = 'js-filter-form__wrap'
export const FILTER_FORM_PRELOADER_CLASS = 'js-filter-form__preloader'
export const FILTER_FORM_LINK_CLASS = 'js-filter-form__link'
export const DATA_FILTER_STATIC_PARAMS = 'data-filter-static-params'
export const DATA_TOTAL = 'data-total'
export const DATA_LIMIT = 'data-limit'
export const DATA_INPUT_MIN_LENGTH = 'data-min-length'
export const FILTER_PAGE = 'page'
export const FILTER_LIMIT = 'limit'
export const PAGE_INNER_CLASS = 'js-page__inner'
export const PAGE_CLASS = 'js-page'

// empty
export const EMPTY_RESULTS_CLASS = 'js-empty-result'
export const SHOW_CLASS_NAME = '_show'

export const USE_MOUSE_CLASS = '_use-mouse'

// YM
export const DATA_GOAL_ID = 'data-goal-id'
export const DATA_GOAL_EVENT = 'data-goal-event'
