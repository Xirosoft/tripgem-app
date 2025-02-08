import Tagify from '@yaireo/tagify'
import '@yaireo/tagify/dist/tagify.css'
import 'dropzone/dist/dropzone.css'
import flatpickr from 'flatpickr'
import 'flatpickr/dist/flatpickr.css'
import $ from 'jquery'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import 'select2'
import 'select2/dist/css/select2.css'

export function initializeAddTour() {
  'use strict'

  //Javascript to handle the e-commerce product add page
  ;(function () {
    let descriptionEditor, itineraryEditor // Store editor instances

    // Comment editor
    function initCommentEditor(selector, toolbarSelector, placeholder) {
      const commentEditor = document.querySelector(selector)

      if (commentEditor) {
        const editor = new Quill(commentEditor, {
          modules: {
            toolbar: toolbarSelector,
          },
          placeholder: placeholder,
          theme: 'snow',
        })
        return editor
      }
      return null
    }

    // Initialize editors and store instances
    descriptionEditor = initCommentEditor(
      '.tour-description-editor',
      '.description-toolbar',
      'Tour Description',
    )
    itineraryEditor = initCommentEditor('.tour-itinerary', '.itinerary-toolbar', 'Tour Itinerary')

    // Function to get editor values
    window.getEditorValues = function () {
      return {
        description: descriptionEditor ? descriptionEditor.root.innerHTML : '',
        itinerary: itineraryEditor ? itineraryEditor.root.innerHTML : '',
      }
    }

    // Basic Tags
    const tagifyBasicEl = document.querySelector('#ecommerce-product-tags')
    new Tagify(tagifyBasicEl)

    // Flatpickr
    const date = new Date()
    const productDate = document.querySelector('.product-date')

    if (productDate) {
      flatpickr(productDate, {
        monthSelectorType: 'static',
        defaultDate: date,
      })
    }
  })()

  //Jquery to handle the e-commerce product add page
  $(function () {
    // Select2
    var select2 = $('.select2')
    if (select2.length) {
      select2.each(function () {
        var $this = $(this)
        $this.wrap('<div class="position-relative"></div>').select2({
          dropdownParent: $this.parent(),
          placeholder: $this.data('placeholder'), // for dynamic placeholder
        })
      })
    }

    var formRepeater = $('.form-repeater')

    // Form Repeater
    if (formRepeater.length) {
      var row = 2
      var col = 1
      formRepeater.on('submit', function (e) {
        e.preventDefault()
      })
      formRepeater.repeater({
        show: function () {
          var fromControl = $(this).find('.form-control, .form-select')
          var formLabel = $(this).find('.form-label')

          fromControl.each(function (i) {
            var id = 'form-repeater-' + row + '-' + col
            $(fromControl[i]).attr('id', id)
            $(formLabel[i]).attr('for', id)
            col++
          })

          row++
          $(this).slideDown()
          $('.select2-container').remove()
          $('.select2.form-select').select2({
            placeholder: 'Placeholder text',
          })
          $('.select2-container').css('width', '100%')
          $('.form-repeater:first .form-select').select2({
            dropdownParent: $(this).parent(),
            placeholder: 'Placeholder text',
          })
          $('.position-relative .select2').each(function () {
            $(this).select2({
              dropdownParent: $(this).closest('.position-relative'),
            })
          })
        },
      })
    }
  })
}
