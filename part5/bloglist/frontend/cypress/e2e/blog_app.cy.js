describe('Blog app', function () {
  const user = {
    name: 'name',
    username: 'username',
    password: 'password'
  }

  const usertwo = {
    name: 'two',
    username: 'testusertwo',
    password: 'numbertwo'
  }

  const blog = {
    title: 'title',
    author: 'author',
    url: 'http://localhost.es'
  }

  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.request('POST', 'http://localhost:3003/api/users/', usertwo)
    cy.request('http://localhost:5173').its('status').should('eq', 200);
    cy.visit('')
  })

  it('Login form is shown', function () {
    cy.contains('log in to application')
    cy.contains('username')
    cy.contains('password')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type(user.username)
      cy.get('#password').type(user.password)
      cy.get('#login-button').click()
      cy.contains(`${user.name} logged-in`)
    })

    it('fails with wrong credentials', function () {
      cy.get('#username').type(user.username)
      cy.get('#password').type(user.password + "zzz")
      cy.get('#login-button').click()
      cy.contains('Wrong username or password').should('have.class', 'error')
    })
  })

  describe('When logged in', function () {
    beforeEach(function () {
      cy.get('#username').type(user.username)
      cy.get('#password').type(user.password)
      cy.get('#login-button').click()
      cy.contains(`${user.name} logged-in`)
    })

    it('A blog can be created', function () {
      cy.contains('new blog').click()
      cy.get('#title').type(blog.title)
      cy.get('#author').type(blog.author)
      cy.get('#url').type(blog.url)
      cy.get('#create').click()
      cy.contains(`${blog.title} ${blog.author}`)
    })

    describe('A blog can be liked and removed by the creator', function () {
      beforeEach(function () {
        cy.contains('new blog').click()
        cy.get('#title').type(blog.title)
        cy.get('#author').type(blog.author)
        cy.get('#url').type(blog.url)
        cy.get('#create').click()
        cy.contains(`${blog.title} ${blog.author}`)
      })

      it('A blog can be liked', function () {
        cy.get('#view').click()
        cy.get('#like').click()
        cy.contains('likes 1')
      })

      it('A blog can be removed', function () {
        cy.get('#view').click()
        cy.get('#remove').click()
        cy.contains(`${blog.title} ${blog.author}`).should('not.exist')
      })
    })
  })

  describe('Not owner user can not remove blog', function () {
    beforeEach(function () {
      // User one logs
      cy.get('#username').type(user.username)
      cy.get('#password').type(user.password)
      cy.get('#login-button').click()
      cy.contains(`${user.name} logged-in`)
      // User one creates a blog
      cy.contains('new blog').click()
      cy.get('#title').type(blog.title)
      cy.get('#author').type(blog.author)
      cy.get('#url').type(blog.url)
      cy.get('#create').click()
      cy.contains(`${blog.title} ${blog.author}`)
      // User one logs out
      cy.get('#logout').click()
      // User two logs in
      cy.get('#username').type(usertwo.username)
      cy.get('#password').type(usertwo.password)
      cy.get('#login-button').click()
      cy.contains(`${usertwo.name} logged-in`)
    })

    it('User can not see the delete button', function () {
      cy.get('#view').click()
      cy.contains('remove').should('not.exist')
    })
  })
})