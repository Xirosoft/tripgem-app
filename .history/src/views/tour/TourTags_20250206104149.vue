<script lang="ts" setup></script>

<template>
  <div class="wrapper">
    <div class="row">
      <div class="col-md-7">
        <div class="card">
          <div class="card-datatable table-responsive pt-0">
            <table class="datatables-basic table">
              <thead>
                <tr>
                  <th><input type="checkbox" name="" id="" /></th>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Slug</th>
                  <th>Description</th>
                </tr>
              </thead>
            </table>
          </div>
        </div>
      </div>
      <div class="col-md-5">
        <div class="card">
          <h5 class="card-header">Add new Tag</h5>
          <div class="card-body">
            <div>
              <label for="defaultFormControlInput" class="form-label">Name</label>
              <input
                type="text"
                class="form-control"
                id="defaultFormControlInput"
                placeholder="John Doe"
                aria-describedby="defaultFormControlHelp"
              />
              <div id="defaultFormControlHelp" class="form-text">
                We'll never share your details with anyone else.
              </div>
            </div>
            <div>
              <label for="defaultFormControlInput" class="form-label">slug</label>
              <input
                type="text"
                class="form-control"
                id="defaultFormControlInput"
                placeholder="John Doe"
                aria-describedby="defaultFormControlHelp"
              />
              <div id="defaultFormControlHelp" class="form-text">
                We'll never share your details with anyone else.
              </div>
            </div>
            <div>
              <label for="defaultFormControlInput" class="form-label">Description</label>
              <textarea
                class="form-control"
                id="defaultFormControlInput"
                placeholder="John Doe"
                aria-describedby="defaultFormControlHelp"
              >
              </textarea>
              <div id="defaultFormControlHelp" class="form-text">
                We'll never share your details with anyone else.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped></style>
