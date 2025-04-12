// Cloudflare Worker for handling form submissions and sending emails

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  // 处理 CORS
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    })
  }

  // 只处理 POST 请求
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    // 解析请求数据
    const formData = await request.json()

    // 验证必填字段
    if (!formData.name || !formData.email || !formData.package) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Missing required fields'
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      )
    }

    // 构建邮件内容
    const emailContent = `
New Order Received:

Customer Information:
- Name: ${formData.name}
- Email: ${formData.email}
- Package: ${formData.package}

Description:
${formData.description || 'No description provided'}

Timestamp: ${new Date().toISOString()}
    `

    // 使用 Cloudflare Email Workers 发送邮件
    const response = await fetch('https://api.mailchannels.net/tx/v1/send', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: 'info@aifigures.org' }],
          },
        ],
        from: {
          email: 'noreply@aifigures.org',
          name: 'AI Figures Order System',
        },
        subject: `New Order: ${formData.package}`,
        content: [
          {
            type: 'text/plain',
            value: emailContent,
          },
        ],
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to send email')
    }

    // 返回成功响应
    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Internal server error'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )
  }
}

// Helper function to get package price
function getPriceForPackage(packageName) {
  const prices = {
    'digital': '$19',
    'basic': '$599',
    'premium': '$999',
    'ultimate': '$1,499'
  }
  return prices[packageName] || 'Price not found'
}

// Helper function to send email using Email Workers
async function sendEmail({ to, from, subject, text }) {
  try {
    const response = await fetch('https://api.mailchannels.net/tx/v1/send', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: to }],
          },
        ],
        from: {
          email: from,
          name: 'AI Figure Generator'
        },
        subject,
        content: [
          {
            type: 'text/plain',
            value: text,
          },
        ],
      }),
    })

    return response.ok
  } catch (error) {
    console.error('Failed to send email:', error)
    return false
  }
} 