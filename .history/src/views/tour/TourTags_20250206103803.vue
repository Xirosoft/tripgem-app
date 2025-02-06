<script lang="ts" setup></script>

<template>
  <div class="card">
    <div class="card-header">
      <h5 class="card-title">Tags</h5>
    </div>
    <div class="card-body">
      <div class="form-group">
        <label for="tags">Tags</label>
        <input type="text" id="tags" class="form-control" placeholder="Enter tags" />
      </div>
    </div>
  </div>
  <div class="wrapper">
    <div class="row">
      <div class="col-md-7">
        <div class="card">
          <div class="card-datatable table-responsive pt-0">
            <table class="datatables-basic table">
              <thead>
                <tr>
                  <th></th>
                  <th></th>
                  <th>id</th>
                  <th>Tour ID</th>
                  <th>Name</th>
                  <th>Slug</th>
                  <th>Salary</th>
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
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped></style>
