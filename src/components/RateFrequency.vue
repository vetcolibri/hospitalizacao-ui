<template>
    <div class="space-y-1">
        <label for="rate" class="block">Repetir a cada</label>
        <div class="flex items-center space-x-2">
            <div class="w-16"><input class="form-control" type="number" name="rate" value="30" required></div>
            <div class="w-32">
                <select class="form-control" required>
                    <option value="minutes">Minutos</option>
                    <option value="hours">Horas</option>
                </select>
            </div>
        </div>
    </div>
</template>