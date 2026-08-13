Add-Type -AssemblyName System.Drawing

function New-Icon {
    param([int]$Size, [string]$OutPath)
    $bmp = New-Object System.Drawing.Bitmap($Size, $Size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = 'AntiAlias'
    $g.InterpolationMode = 'HighQualityBicubic'

    $rect = New-Object System.Drawing.Rectangle(0, 0, $Size, $Size)
    $c1 = [System.Drawing.Color]::FromArgb(124, 58, 237)   # violet-600
    $c2 = [System.Drawing.Color]::FromArgb(34, 211, 238)   # cyan-500
    $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $c1, $c2, 45)
    $g.FillRectangle($brush, $rect)
    $brush.Dispose()

    # rounded phone body
    $w = [int]($Size * 0.42)
    $h = [int]($Size * 0.62)
    $x = [int](($Size - $w) / 2)
    $y = [int](($Size - $h) / 2)
    $phoneRect = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
    $radius = [int]($Size * 0.06)
    $diameter = $radius * 2
    $gPath = New-Object System.Drawing.Drawing2D.GraphicsPath
    $gPath.AddArc($x, $y, $diameter, $diameter, 180, 90)
    $gPath.AddArc($x + $w - $diameter, $y, $diameter, $diameter, 270, 90)
    $gPath.AddArc($x + $w - $diameter, $y + $h - $diameter, $diameter, $diameter, 0, 90)
    $gPath.AddArc($x, $y + $h - $diameter, $diameter, $diameter, 90, 90)
    $gPath.CloseFigure()
    $penW = [math]::Max(2, [int]($Size * 0.04))
    $pen = New-Object System.Drawing.Pen([System.Drawing.Color]::White, $penW)
    $pen.LineJoin = 'Round'
    $g.DrawPath($pen, $gPath)

    # speaker notch
    $notchW = [int]($Size * 0.16)
    $notchX = [int](($Size - $notchW) / 2)
    $notchY = [int]($y + $Size * 0.05)
    $g.FillEllipse([System.Drawing.Brushes]::White, $notchX, $notchY, $notchW, [int]($Size * 0.02))

    # home button
    $btnW = [int]($Size * 0.16)
    $btnH = [int]($Size * 0.02)
    $btnX = [int](($Size - $btnW) / 2)
    $btnY = [int]($y + $h - $Size * 0.07)
    $g.FillEllipse([System.Drawing.Brushes]::White, $btnX, $btnY, $btnW, $btnH)

    $pen.Dispose()
    $gPath.Dispose()
    $g.Dispose()
    $bmp.Save($OutPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
}

$root = Split-Path -Parent $PSScriptRoot
New-Icon -Size 192 -OutPath "$root\public\icon-192.png"
New-Icon -Size 512 -OutPath "$root\public\icon-512.png"
Write-Output "Icons generated."
