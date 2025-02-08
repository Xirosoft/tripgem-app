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
    // Comment editor
    function initCommentEditor(selector, toolbarSelector, placeholder) {
      const commentEditor = document.querySelector(selector)

      if (commentEditor) {
        new Quill(commentEditor, {
          modules: {
            toolbar: toolbarSelector,
          },
          placeholder: placeholder,
          theme: 'snow',
        })
      }
    }

    initCommentEditor('.tour-description-editor', '.description-toolbar', 'Tour Description')
    initCommentEditor('.tour-itinerary', '.itinerary-toolbar', 'Tour Itinerary')

    // previewTemplate: Updated Dropzone default previewTemplate
    const previewTemplate = `<div class="dz-preview dz-file-preview">
      <div class="dz-details">
        <div class="dz-thumbnail">
          <img data-dz-thumbnail>
          <span class="dz-nopreview">No preview</span>
          <div class="dz-success-mark"></div>
          <div class="dz-error-mark"></div>
          <div class="dz-error-message"><span data-dz-errormessage></span></div>
          <div class="progress">
            <div class="progress-bar progress-bar-primary" role="progressbar" aria-valuemin="0" aria-valuemax="100" data-dz-uploadprogress></div>
          </div>
        </div>
        <div class="dz-filename" data-dz-name></div>
        <div class="dz-size" data-dz-size></div>
      </div>
    </div>`

    // // Basic Dropzone

    // function dropzoneFileAdded(selector) {
    //   const dropzoneBasic = document.querySelector(selector)
    //   if (dropzoneBasic) {
    //     new Dropzone(dropzoneBasic, {
    //       previewTemplate: previewTemplate,
    //       parallelUploads: 1,
    //       maxFilesize: 5,
    //       acceptedFiles: '.jpg,.jpeg,.png,.gif',
    //       addRemoveLinks: true,
    //       maxFiles: 1,
    //     })
    //   }
    // }

    // dropzoneFileAdded('#thumbnail', 'thumbnail')
    // dropzoneFileAdded('#image_gallery', 'image_gallery')
    // dropzoneFileAdded('#video_gallery', 'video_gallery')

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
